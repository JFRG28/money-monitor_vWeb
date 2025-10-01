"""
Schemas de la aplicación
"""
from app.schemas.gasto import GastoCreate, GastoUpdate, GastoResponse, GastoInDB
from app.schemas.balance import BalanceCreate, BalanceUpdate, BalanceResponse, BalanceInDB
from app.schemas.deuda import DeudaCreate, DeudaUpdate, DeudaResponse, DeudaInDB

__all__ = [
    "GastoCreate",
    "GastoUpdate",
    "GastoResponse",
    "GastoInDB",
    "BalanceCreate",
    "BalanceUpdate",
    "BalanceResponse",
    "BalanceInDB",
    "DeudaCreate",
    "DeudaUpdate",
    "DeudaResponse",
    "DeudaInDB",
]
