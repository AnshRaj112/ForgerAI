from pydantic import BaseModel, Field


class AgentExecutionRequest(BaseModel):
    agent_id: str = Field(..., description="Unique agent identifier")
    prompt: str = Field(..., description="User prompt for the agent")
    context: dict[str, object] = Field(default_factory=dict)
    temperature: float | None = Field(default=None, ge=0.0, le=2.0)
    provider: str | None = Field(default=None, description="Groq inference provider")


class AgentExecutionResponse(BaseModel):
    ok: bool = True
    agent_id: str
    provider: str
    model: str
    output: str
    trace: list[str] = Field(default_factory=list)


class HealthResponse(BaseModel):
    ok: bool = True
    service: str
