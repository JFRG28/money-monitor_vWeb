"""
Schemas de Gasto (Pydantic models para validación)
"""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, validator
from app.core.constants import TipoGasto, Categoria, FormaPago, Mes


class GastoBase(BaseModel):
    """Schema base de Gasto"""
    concepto: str = Field(..., min_length=1, max_length=255)
    monto: Decimal = Field(..., gt=0, decimal_places=2)
    tipo_gasto: TipoGasto
    forma_pago: FormaPago
    mes: Mes
    anio: int = Field(..., ge=2000, le=2100)
    fecha_cargo: date
    fecha_pago: date
    categoria: Categoria
    a_pagos: bool = False
    no_mens: int = Field(default=0, ge=0)
    total_meses: int = Field(default=0, ge=0)
    tag: str = Field(default="NA", max_length=50)
    se_divide: bool = False
    gasto_x_mes: str = Field(default="NA", max_length=20)


class GastoCreate(GastoBase):
    """Schema para crear un gasto"""
    pass


class GastoUpdate(BaseModel):
    """Schema para actualizar un gasto"""
    concepto: Optional[str] = Field(None, min_length=1, max_length=255)
    monto: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    tipo_gasto: Optional[TipoGasto] = None
    forma_pago: Optional[FormaPago] = None
    mes: Optional[Mes] = None
    anio: Optional[int] = Field(None, ge=2000, le=2100)
    fecha_cargo: Optional[date] = None
    fecha_pago: Optional[date] = None
    categoria: Optional[Categoria] = None
    a_pagos: Optional[bool] = None
    no_mens: Optional[int] = Field(None, ge=0)
    total_meses: Optional[int] = Field(None, ge=0)
    tag: Optional[str] = Field(None, max_length=50)
    se_divide: Optional[bool] = None
    gasto_x_mes: Optional[str] = Field(None, max_length=20)


class GastoInDB(GastoBase):
    """Schema de Gasto en base de datos"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GastoResponse(GastoInDB):
    """Schema de respuesta de Gasto"""
    pass
