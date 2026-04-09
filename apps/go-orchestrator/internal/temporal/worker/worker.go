package workerx

import (
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"

	"github.com/forgerai/go-orchestrator/internal/temporal/workflows"
)

func New(c client.Client, taskQueue string) worker.Worker {
	w := worker.New(c, taskQueue, worker.Options{})
	w.RegisterWorkflow(workflows.CompileWorkflow)
	w.RegisterWorkflow(workflows.DeployWorkflow)
	w.RegisterActivity(workflows.CompileActivity)
	w.RegisterActivity(workflows.DeployActivity)
	return w
}
