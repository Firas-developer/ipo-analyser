from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "IPO Assistant Backend"

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    # Choose which provider you want to use: "gemini", "groq" or "openai"
    LLM_PROVIDER: str = "gemini"

    # Gemini settings (free, fast, powerful)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # Groq settings (free, fast)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "groq/compound-mini"

    # OpenAI settings (optional, if you switch later)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"


settings = Settings()
