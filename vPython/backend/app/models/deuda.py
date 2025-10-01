"""
Modelo de Deuda
"""
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class Deuda(Base):
    """Modelo de deudas"""
    __tablename__ = "deudas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tipo = Column(String, nullable=False)  # T = Tarjeta, O = Otro
    item = Column(String, nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    fecha = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Deuda(id={self.id}, tipo='{self.tipo}', item='{self.item}')>"
