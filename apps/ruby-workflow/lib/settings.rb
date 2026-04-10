# frozen_string_literal: true

module Settings
  module_function

  def mongo_uri
    ENV.fetch("FORGE_DATABASE_URL", "mongodb://127.0.0.1:27017/forgeai")
  end

  def redis_url
    ENV.fetch("FORGE_REDIS_URL", "redis://127.0.0.1:6379")
  end

  def nats_url
    ENV.fetch("FORGE_NATS_URL", "nats://127.0.0.1:4222")
  end

  def nats_subject
    ENV.fetch("FORGE_NATS_WORKFLOW_SUBJECT", "forge.>")
  end

  def cors_origins
    ENV.fetch("FORGE_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
         .split(",")
         .map(&:strip)
         .reject(&:empty?)
  end

  def workflow_queue_key
    ENV.fetch("FORGE_WORKFLOW_QUEUE_KEY", "forge:workflow:queue")
  end
end
