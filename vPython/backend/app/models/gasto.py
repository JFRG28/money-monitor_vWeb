"""
Modelo de Gasto
"""
from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class Gasto(Base):
    """Modelo de gastos - Equivalente a la tabla gastos"""
    __tablename__ = "gastos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    concepto = Column(String, nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    tipo_gasto = Column(String, nullable=False)
    forma_pago = Column(String, nullable=False)
    mes = Column(String, nullable=False)
    anio = Column(Integer, nullable=False)
    fecha_cargo = Column(Date, nullable=False)
    fecha_pago = Column(Date, nullable=False)
    categoria = Column(String, nullable=False)
    a_pagos = Column(Boolean, default=False)
    no_mens = Column(Integer, default=0)
    total_meses = Column(Integer, default=0)
    tag = Column(String, default="NA")
    se_divide = Column(Boolean, default=False)
    gasto_x_mes = Column(String, default="NA")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Gasto(id={self.id}, concepto='{self.concepto}', monto={self.monto})>"
