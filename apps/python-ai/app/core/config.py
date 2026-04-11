from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    service_name: str = Field(default="python-ai", alias="SERVICE_NAME")
    port: int = Field(default=4002, alias="PORT")
    app_env: str = Field(default="development", alias="APP_ENV")

    llm_provider: str = Field(default="groq", alias="LLM_PROVIDER")
    groq_api_key: str | None = Field(default=None, alias="GROQ_API_KEY")
    groq_model: str = Field(default="llama-3.1-8b-instant", alias="GROQ_MODEL")
    default_temperature: float = Field(default=0.2, alias="DEFAULT_TEMPERATURE")

    nats_url: str = Field(default="nats://localhost:4222", alias="FORGE_NATS_URL")
    nats_subject_agent_run: str = Field(default="forge.agent.run", alias="NATS_SUBJECT_AGENT_RUN")
    nats_subject_agent_result: str = Field(default="forge.agent.result", alias="NATS_SUBJECT_AGENT_RESULT")

    model_config = SettingsConfigDict(populate_by_name=True, case_sensitive=False, extra="ignore")


settings = Settings()
