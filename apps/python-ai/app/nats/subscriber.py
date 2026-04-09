import asyncio
import json
import logging

from nats.aio.client import Client as NATS
from nats.aio.msg import Msg

from app.agent.graph import execute_agent
from app.core.config import settings
from app.schemas import AgentExecutionRequest

logger = logging.getLogger(__name__)


class NATSSubscriber:
    def __init__(self) -> None:
        self._nc: NATS | None = None
        self._sub_sid: int | None = None

    async def connect(self) -> None:
        self._nc = NATS()
        await self._nc.connect(settings.nats_url, name=f"{settings.service_name}-subscriber")
        self._sub_sid = await self._nc.subscribe(settings.nats_subject_agent_run, cb=self._on_message)
        logger.info("Subscribed to subject '%s'", settings.nats_subject_agent_run)

    async def close(self) -> None:
        if self._nc is not None:
            if self._sub_sid is not None:
                await self._nc.unsubscribe(self._sub_sid)
            await self._nc.drain()

    async def _on_message(self, msg: Msg) -> None:
        if self._nc is None:
            return

        try:
            payload = json.loads(msg.data.decode("utf-8"))
            request = AgentExecutionRequest.model_validate(payload)
            result = await asyncio.to_thread(execute_agent, request)

            response = {
                "ok": True,
                "agent_id": request.agent_id,
                "provider": result.get("provider"),
                "model": result.get("model"),
                "output": result.get("output"),
                "trace": result.get("trace", []),
            }
            await self._nc.publish(settings.nats_subject_agent_result, json.dumps(response).encode("utf-8"))
        except Exception:
            logger.exception("Failed processing NATS message")
