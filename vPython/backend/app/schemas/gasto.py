"""
Schemas de Gasto (Pydantic models para validación)
"""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, validator
from app.core.constants import TipoGasto, Categoria, FormaPago, Mes, TIPOS_GASTO, CATEGORIAS, FORMAS_PAGO, MESES


class GastoBase(BaseModel):
    """Schema base de Gasto"""
    concepto: str = Field(..., min_length=1, max_length=255)
    monto: Decimal = Field(..., gt=0, decimal_places=2)
    tipo_gasto: str = Field(..., min_length=1, max_length=50)
    forma_pago: str = Field(..., min_length=1, max_length=100)
    mes: str = Field(..., min_length=1, max_length=20)
    anio: int = Field(..., ge=2000, le=2100)
    fecha_cargo: date
    fecha_pago: date
    categoria: str = Field(..., min_length=1, max_length=10)
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
    tipo_gasto: Optional[str] = Field(None, min_length=1, max_length=50)
    forma_pago: Optional[str] = Field(None, min_length=1, max_length=100)
    mes: Optional[str] = Field(None, min_length=1, max_length=20)
    anio: Optional[int] = Field(None, ge=2000, le=2100)
    fecha_cargo: Optional[date] = None
    fecha_pago: Optional[date] = None
    categoria: Optional[str] = Field(None, min_length=1, max_length=10)
    a_pagos: Optional[bool] = None
    no_mens: Optional[int] = Field(None, ge=0)
    total_meses: Optional[int] = Field(None, ge=0)
    tag: Optional[str] = Field(None, max_length=50)
    se_divide: Optional[bool] = None
    gasto_x_mes: Optional[str] = Field(None, max_length=20)


class GastoInDB(BaseModel):
    """Schema de Gasto en base de datos"""
    id: int
    concepto: str
    monto: Decimal  # Sin validación gt=0 para permitir negativos en BD
    tipo_gasto: str
    forma_pago: str
    mes: str
    anio: int
    fecha_cargo: date
    fecha_pago: date
    categoria: str
    a_pagos: bool
    no_mens: int
    total_meses: int
    tag: str
    se_divide: bool
    gasto_x_mes: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GastoResponse(GastoInDB):
    """Schema de respuesta de Gasto"""
    pass
