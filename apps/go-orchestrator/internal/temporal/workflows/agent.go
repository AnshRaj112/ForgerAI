package workflows

import (
	"context"
	"time"

	"go.temporal.io/sdk/activity"
	"go.temporal.io/sdk/workflow"
)

type CompileInput struct {
	ProjectID string `json:"projectId"`
	ActorID   string `json:"actorId"`
}

type CompileResult struct {
	ArtifactURI string `json:"artifactUri"`
}

type DeployInput struct {
	JobID       string `json:"jobId"`
	Environment string `json:"environment"`
}

type DeployResult struct {
	DeploymentID string `json:"deploymentId"`
}

func CompileWorkflow(ctx workflow.Context, input CompileInput) (CompileResult, error) {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: 30 * time.Second,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	var result CompileResult
	if err := workflow.ExecuteActivity(ctx, CompileActivity, input).Get(ctx, &result); err != nil {
		return CompileResult{}, err
	}
	return result, nil
}

func DeployWorkflow(ctx workflow.Context, input DeployInput) (DeployResult, error) {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: 30 * time.Second,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	var result DeployResult
	if err := workflow.ExecuteActivity(ctx, DeployActivity, input).Get(ctx, &result); err != nil {
		return DeployResult{}, err
	}
	return result, nil
}

func CompileActivity(ctx context.Context, input CompileInput) (CompileResult, error) {
	activity.GetLogger(ctx).Info("compile activity", "projectId", input.ProjectID, "actorId", input.ActorID)
	return CompileResult{
		ArtifactURI: "forge://artifacts/" + input.ProjectID + "/latest",
	}, nil
}

func DeployActivity(ctx context.Context, input DeployInput) (DeployResult, error) {
	activity.GetLogger(ctx).Info("deploy activity", "jobId", input.JobID, "environment", input.Environment)
	return DeployResult{
		DeploymentID: "deploy-" + input.JobID,
	}, nil
}
