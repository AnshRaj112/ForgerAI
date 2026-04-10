# frozen_string_literal: true

require "mongo"
require "redis"

# Shared MongoDB and Redis connections for the API and NATS handler.
module Clients
  module_function

  def mongo
    @mongo ||= Mongo::Client.new(
      Settings.mongo_uri,
      server_selection_timeout: 5,
      connect_timeout: 5,
      socket_timeout: 5
    )
  end

  def redis
    @redis ||= Redis.new(
      url: Settings.redis_url,
      reconnect_attempts: 3,
      timeout: 5
    )
  end

  def workflow_runs
    mongo.database.collection("workflow_runs")
  end

  def nats_inbox
    mongo.database.collection("nats_workflow_inbox")
  end
end
