"""
Configuración de la aplicación
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator
import json


class Settings(BaseSettings):
    """Configuración de la aplicación"""
    
    # App
    APP_NAME: str = "Money Monitor API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 3001
    
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 días
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"]
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [v]
        return v
    
    # Rate Limiting
    RATE_LIMIT_TIMES: int = 100
    RATE_LIMIT_SECONDS: int = 900
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
