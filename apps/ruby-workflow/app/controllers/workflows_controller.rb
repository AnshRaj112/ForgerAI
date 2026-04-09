class WorkflowsController < ApplicationController
  def start
    workflow_id = params[:workflowId] || "default-workflow"
    render json: { ok: true, runId: "run-#{workflow_id}-#{Time.now.to_i}" }
  end
end
