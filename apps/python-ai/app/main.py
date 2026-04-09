from contextlib import asynccontextmanager
import asyncio
import logging

from fastapi import FastAPI, HTTPException

from app.agent.graph import execute_agent
from app.core.config import settings
from app.nats.subscriber import NATSSubscriber
from app.schemas import AgentExecutionRequest, AgentExecutionResponse, HealthResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)

nats_subscriber = NATSSubscriber()


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        await nats_subscriber.connect()
    except Exception:
        logger.exception("NATS subscriber startup failed")
    yield
    await nats_subscriber.close()


app = FastAPI(
    title="ForgeAI Python AI Service",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(ok=True, service=settings.service_name)


@app.post("/agents/run", response_model=AgentExecutionResponse)
async def run_agent(request: AgentExecutionRequest) -> AgentExecutionResponse:
    try:
        result = await asyncio.to_thread(execute_agent, request)
    except Exception as exc:
        logger.exception("Agent execution failed")
        raise HTTPException(status_code=500, detail=f"Execution failed: {exc}") from exc

    return AgentExecutionResponse(
        ok=True,
        agent_id=request.agent_id,
        provider=str(result.get("provider", settings.llm_provider)),
        model=str(result.get("model", "")),
        output=str(result.get("output", "")),
        trace=list(result.get("trace", [])),
    )
