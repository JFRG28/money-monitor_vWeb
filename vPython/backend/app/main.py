"""
Aplicación principal de FastAPI
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time

from app.core.config import settings
from app.middleware.error_handler import (
    catch_exceptions_middleware,
    validation_exception_handler,
    database_exception_handler
)
from app.api.routes import gastos, balance, deudas, catalogos, dashboard

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API para gestión de gastos personales"
)

# Guardar settings en app state
app.state.settings = settings

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, database_exception_handler)

# Middleware global de errores
app.middleware("http")(catch_exceptions_middleware)


# Middleware de logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware para logging de requests"""
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    print(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.2f}s")
    
    return response


# Health check
@app.get("/api/health")
@limiter.limit(f"{settings.RATE_LIMIT_TIMES}/{settings.RATE_LIMIT_SECONDS}seconds")
async def health_check(request: Request):
    """Endpoint de health check"""
    return {
        "status": "OK",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }


# Incluir routers
app.include_router(gastos.router, prefix="/api")
app.include_router(balance.router, prefix="/api")
app.include_router(deudas.router, prefix="/api")
app.include_router(catalogos.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


# Ruta raíz
@app.get("/")
async def root():
    """Ruta raíz"""
    return {
        "message": f"Bienvenido a {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
