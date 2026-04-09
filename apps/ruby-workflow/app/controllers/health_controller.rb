class HealthController < ApplicationController
  def index
    render json: { ok: true, service: "ruby-workflow" }
  end
end
