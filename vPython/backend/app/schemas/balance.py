"""
Schemas de Balance
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class BalanceBase(BaseModel):
    """Schema base de Balance"""
    tipo: str = Field(..., min_length=1, max_length=20, description="Tipo de balance: D=Débito, I=Inversión")
    concepto: str = Field(..., min_length=1, max_length=255)
    monto: Decimal = Field(..., gt=0, decimal_places=2)
    deben_ser: Decimal = Field(default=Decimal("0.00"), ge=0, decimal_places=2)
    diferencia: Decimal = Field(default=Decimal("0.00"), decimal_places=2)
    comentarios: Optional[str] = Field(None, max_length=500)


class BalanceCreate(BalanceBase):
    """Schema para crear balance"""
    pass


class BalanceUpdate(BaseModel):
    """Schema para actualizar balance"""
    tipo: Optional[str] = Field(None, min_length=1, max_length=10)
    concepto: Optional[str] = Field(None, min_length=1, max_length=255)
    monto: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    deben_ser: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    diferencia: Optional[Decimal] = Field(None, decimal_places=2)
    comentarios: Optional[str] = Field(None, max_length=500)


class BalanceInDB(BalanceBase):
    """Schema de Balance en base de datos"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BalanceResponse(BalanceInDB):
    """Schema de respuesta de Balance"""
    pass
