# frozen_string_literal: true

require "bundler/setup"
Bundler.require(:default)

require_relative "lib/settings"
require_relative "lib/clients"
require_relative "lib/nats_subscriber"
require_relative "app/workflow_app"

NatsSubscriber.start!

use Rack::Cors do
  allow do
    origins(*Settings.cors_origins)
    resource "*",
             headers: :any,
             methods: %i[get post put patch delete options]
  end
end

run WorkflowApp
