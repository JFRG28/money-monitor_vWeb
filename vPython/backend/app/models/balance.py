"""
Modelo de Balance
"""
from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class Balance(Base):
    """Modelo de balance de cuentas"""
    __tablename__ = "balance"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tipo = Column(String, nullable=False)  # D = Debe, C = Crédito
    concepto = Column(String, nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    deben_ser = Column(Numeric(10, 2), default=0)
    diferencia = Column(Numeric(10, 2), default=0)  # monto - deben_ser
    comentarios = Column(String, nullable=True)  # Campo de texto libre
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Balance(id={self.id}, tipo='{self.tipo}', concepto='{self.concepto}')>"
