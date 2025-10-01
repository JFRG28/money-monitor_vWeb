"""
Schemas de Deuda
"""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class DeudaBase(BaseModel):
    """Schema base de Deuda"""
    tipo: str = Field(..., min_length=1, max_length=10)
    item: str = Field(..., min_length=1, max_length=255)
    monto: Decimal = Field(..., gt=0, decimal_places=2)
    fecha: date


class DeudaCreate(DeudaBase):
    """Schema para crear deuda"""
    pass


class DeudaUpdate(BaseModel):
    """Schema para actualizar deuda"""
    tipo: Optional[str] = Field(None, min_length=1, max_length=10)
    item: Optional[str] = Field(None, min_length=1, max_length=255)
    monto: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    fecha: Optional[date] = None


class DeudaInDB(DeudaBase):
    """Schema de Deuda en base de datos"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DeudaResponse(DeudaInDB):
    """Schema de respuesta de Deuda"""
    pass
