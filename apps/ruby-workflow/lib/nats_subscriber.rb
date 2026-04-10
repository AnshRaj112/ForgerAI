# frozen_string_literal: true

require "json"
require "nats/io/client"

# Background NATS subscriber: persists messages under FORGE_NATS_WORKFLOW_SUBJECT to MongoDB
# and bumps a Redis counter for observability.
module NatsSubscriber
  module_function

  @mutex = Mutex.new
  @started = false

  def start!
    @mutex.synchronize do
      return if @started

      @started = true
      Thread.new(name: "nats-workflow-subscriber") { run_forever }
    end
  end

  def run_forever
    loop do
      client = NATS::IO::Client.new
      begin
        client.connect(
          servers: [Settings.nats_url],
          reconnect: true,
          max_reconnect_attempts: -1,
          reconnect_time_wait: 2
        )
        client.subscribe(Settings.nats_subject) { |msg| handle_message(msg) }
        # Reader runs inside the client; block until disconnected.
        loop do
          break unless client.connected?

          sleep 1
        end
      rescue Interrupt
        break
      rescue StandardError => e
        warn "[nats] subscriber error: #{e.class}: #{e.message}"
        sleep 3
      ensure
        client&.close
      end
    end
  end

  def handle_message(msg)
    payload =
      begin
        JSON.parse(msg.data)
      rescue JSON::ParserError
        { "raw" => msg.data.to_s }
      end

    Clients.nats_inbox.insert_one(
      subject: msg.subject,
      payload: payload,
      received_at: Time.now.utc
    )
    Clients.redis.incr("forge:workflow:nats:received")
  rescue StandardError => e
    warn "[nats] handle_message: #{e.class}: #{e.message}"
  end
end
