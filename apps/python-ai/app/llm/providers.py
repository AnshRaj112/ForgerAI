from langchain_core.language_models import BaseChatModel
from langchain_groq import ChatGroq

from app.core.config import settings


def resolve_provider(provider: str | None) -> tuple[str, str]:
    selected = (provider or settings.llm_provider).lower().strip()
    if selected != "groq":
        raise ValueError("Only 'groq' is supported as an LLM provider.")
    return selected, settings.groq_model


def get_chat_model(provider: str | None, temperature: float | None) -> tuple[str, str, BaseChatModel]:
    selected, model_name = resolve_provider(provider)
    model_temp = settings.default_temperature if temperature is None else temperature

    return selected, model_name, ChatGroq(
        model=model_name,
        groq_api_key=settings.groq_api_key,
        temperature=model_temp,
    )
