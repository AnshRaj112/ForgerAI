package orchestrator

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.temporal.io/sdk/client"

	"github.com/forgerai/go-orchestrator/internal/temporal/workflows"
)

type Service struct {
	mongoClient *mongo.Client
	temporal    client.Client
	taskQueue   string
}

type CompileRequest struct {
	ProjectID string `json:"projectId"`
	ActorID   string `json:"actorId"`
}

type CompileResponse struct {
	JobID       string `json:"jobId"`
	ArtifactURI string `json:"artifactUri"`
	Status      string `json:"status"`
}

type DeployRequest struct {
	JobID       string `json:"jobId"`
	Environment string `json:"environment"`
}

type DeployResponse struct {
	JobID        string `json:"jobId"`
	DeploymentID string `json:"deploymentId"`
	Status       string `json:"status"`
}

func NewService(mongoClient *mongo.Client, temporal client.Client, taskQueue string) *Service {
	return &Service{
		mongoClient: mongoClient,
		temporal:    temporal,
		taskQueue:   taskQueue,
	}
}

func (s *Service) Compile(ctx context.Context, req CompileRequest) (CompileResponse, error) {
	workflowID := fmt.Sprintf("compile-%s-%d", req.ProjectID, time.Now().UnixNano())
	run, err := s.temporal.ExecuteWorkflow(ctx, client.StartWorkflowOptions{
		ID:        workflowID,
		TaskQueue: s.taskQueue,
	}, workflows.CompileWorkflow, workflows.CompileInput{
		ProjectID: req.ProjectID,
		ActorID:   req.ActorID,
	})
	if err != nil {
		return CompileResponse{}, fmt.Errorf("start compile workflow: %w", err)
	}

	var result workflows.CompileResult
	if err := run.Get(ctx, &result); err != nil {
		return CompileResponse{}, fmt.Errorf("wait compile workflow: %w", err)
	}

	return CompileResponse{
		JobID:       run.GetID(),
		ArtifactURI: result.ArtifactURI,
		Status:      "compiled",
	}, nil
}

func (s *Service) Deploy(ctx context.Context, req DeployRequest) (DeployResponse, error) {
	workflowID := fmt.Sprintf("deploy-%s-%d", req.JobID, time.Now().UnixNano())
	run, err := s.temporal.ExecuteWorkflow(ctx, client.StartWorkflowOptions{
		ID:        workflowID,
		TaskQueue: s.taskQueue,
	}, workflows.DeployWorkflow, workflows.DeployInput{
		JobID:       req.JobID,
		Environment: req.Environment,
	})
	if err != nil {
		return DeployResponse{}, fmt.Errorf("start deploy workflow: %w", err)
	}

	var result workflows.DeployResult
	if err := run.Get(ctx, &result); err != nil {
		return DeployResponse{}, fmt.Errorf("wait deploy workflow: %w", err)
	}

	return DeployResponse{
		JobID:        req.JobID,
		DeploymentID: result.DeploymentID,
		Status:       "deployed",
	}, nil
}

func (s *Service) Health(_ context.Context) map[string]any {
	return map[string]any{
		"ok":      true,
		"service": "go-orchestrator",
		"mongo":   s.mongoClient != nil,
		"temporal": s.temporal != nil,
	}
}
