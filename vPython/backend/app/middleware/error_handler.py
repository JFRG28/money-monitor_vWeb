"""
Middleware de manejo de errores
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import traceback


async def catch_exceptions_middleware(request: Request, call_next):
    """Middleware global para capturar excepciones"""
    try:
        return await call_next(request)
    except Exception as exc:
        print(f"Error no manejado: {exc}")
        print(traceback.format_exc())
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "Error interno del servidor",
                "detail": str(exc) if request.app.state.settings.ENVIRONMENT == "development" else None
            }
        )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler para errores de validación de Pydantic"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Datos de entrada inválidos",
            "errors": errors
        }
    )


async def database_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handler para errores de base de datos"""
    print(f"Error de base de datos: {exc}")
    print(traceback.format_exc())
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Error de base de datos",
            "detail": str(exc) if request.app.state.settings.ENVIRONMENT == "development" else None
        }
    )
