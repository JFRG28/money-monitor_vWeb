"""
Production configuration for Money Monitor API
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator
import json


class ProductionSettings(BaseSettings):
    """Production configuration settings"""
    
    # App
    APP_NAME: str = "Money Monitor API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 3001
    
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 días
    
    # CORS - More restrictive for production
    CORS_ORIGINS: List[str] = ["http://localhost", "https://yourdomain.com"]
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [v]
        return v
    
    # Rate Limiting - More restrictive for production
    RATE_LIMIT_TIMES: int = 50
    RATE_LIMIT_SECONDS: int = 900
    
    # Security
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "yourdomain.com"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


production_settings = ProductionSettings()
