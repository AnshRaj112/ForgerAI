# frozen_string_literal: true

require "sinatra/base"
require "json"
require "bson"

# Lightweight workflow HTTP API (Sinatra). Controllers are split as nested apps mounted below.
class WorkflowApp < Sinatra::Base
  set :dump_errors, false
  set :raise_errors, false
  set :show_exceptions, false

  helpers do
    def read_json
      body = request.body.read.to_s
      return {} if body.strip.empty?

      JSON.parse(body)
    rescue JSON::ParserError
      halt 400, json_error("invalid json", 400)
    end

    def json_ok(data, status = 200)
      content_type :json
      status status
      JSON.generate(data)
    end

    def json_error(message, status = 400)
      content_type :json
      status status
      JSON.generate(ok: false, error: message)
    end
  end

  not_found do
    json_error("not found", 404)
  end

  error BSON::Error::InvalidObjectId do
    json_error("invalid id", 400)
  end

  error do
    e = env["sinatra.error"]
    warn "[workflow] #{e.class}: #{e.message}"
    json_error("internal error", 500)
  end

  get "/health" do
    checks = { mongo: "fail", redis: "fail", nats: "unknown" }
    begin
      Clients.mongo.database.command(ping: 1)
      checks[:mongo] = "ok"
    rescue StandardError
      checks[:mongo] = "fail"
    end

    begin
      Clients.redis.ping == "PONG" ? (checks[:redis] = "ok") : (checks[:redis] = "fail")
    rescue StandardError
      checks[:redis] = "fail"
    end

    checks[:nats] = "background" # subscriber thread; no shared connected flag without coupling

    ok = checks[:mongo] == "ok" && checks[:redis] == "ok"
    status ok ? 200 : 503
    json_ok(
      {
        ok: ok,
        service: "ruby-workflow",
        version: "0.1.0",
        checks: checks
      },
      ok ? 200 : 503
    )
  end

  # --- Workflow execution (primary API) ---

  post "/workflows/start" do
    body = read_json
    workflow_id = body["workflowId"] || body["workflow_id"] || "default-workflow"
    input = body["input"] || {}

    id = BSON::ObjectId.new
    now = Time.now.utc
    doc = {
      _id: id,
      workflow_id: workflow_id,
      status: "queued",
      input: input,
      output: nil,
      created_at: now,
      updated_at: now,
      source: "api"
    }
    Clients.workflow_runs.insert_one(doc)

    queue_payload = JSON.generate({ runId: id.to_s, workflowId: workflow_id })
    Clients.redis.lpush(Settings.workflow_queue_key, queue_payload)

    json_ok(ok: true, runId: id.to_s, status: "queued")
  end

  post "/workflows/execute" do
    body = read_json
    run_id = body["runId"] || body["run_id"]
    halt 400, json_error("runId required") if run_id.nil? || run_id.to_s.empty?

    oid = BSON::ObjectId.from_string(run_id.to_s)
    coll = Clients.workflow_runs
    doc = coll.find(_id: oid).first
    halt 404, json_error("run not found", 404) unless doc

    now = Time.now.utc
    coll.update_one(
      { _id: oid },
      { "$set" => { status: "running", updated_at: now } }
    )

    # Stub execution — replace with real orchestration (Temporal, sidekiq, etc.).
    output = {
      message: "workflow executed",
      completedSteps: %w[validate run finalize],
      finishedAt: Time.now.utc.iso8601
    }
    coll.update_one(
      { _id: oid },
      { "$set" => { status: "completed", output: output, updated_at: Time.now.utc } }
    )

    json_ok(ok: true, runId: run_id.to_s, status: "completed", output: output)
  end

  get "/workflows/:id" do
    oid = BSON::ObjectId.from_string(params[:id])
    doc = Clients.workflow_runs.find(_id: oid).first
    halt 404, json_error("run not found", 404) unless doc

    json_ok(
      ok: true,
      run: {
        id: doc["_id"].to_s,
        workflowId: doc["workflow_id"],
        status: doc["status"],
        input: doc["input"],
        output: doc["output"],
        createdAt: doc["created_at"]&.iso8601,
        updatedAt: doc["updated_at"]&.iso8601,
        source: doc["source"]
      }
    )
  end

  # Queue depth for operators
  get "/workflows/queue/stats" do
    depth = Clients.redis.llen(Settings.workflow_queue_key)
    nats_rx = Clients.redis.get("forge:workflow:nats:received").to_i
    json_ok(ok: true, queueDepth: depth, natsMessagesReceived: nats_rx)
  end
end
