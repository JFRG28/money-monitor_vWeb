"""
Controlador de Deudas
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.deuda import Deuda
from app.schemas.deuda import DeudaCreate, DeudaUpdate


def get_all_deudas(db: Session) -> List[Deuda]:
    """Obtener todas las deudas"""
    return db.query(Deuda).order_by(Deuda.fecha.desc()).all()


def get_deuda_by_id(db: Session, deuda_id: int) -> Optional[Deuda]:
    """Obtener deuda por ID"""
    return db.query(Deuda).filter(Deuda.id == deuda_id).first()


def create_deuda(db: Session, deuda: DeudaCreate) -> Deuda:
    """Crear nueva deuda"""
    db_deuda = Deuda(**deuda.model_dump())
    db.add(db_deuda)
    db.commit()
    db.refresh(db_deuda)
    return db_deuda


def update_deuda(db: Session, deuda_id: int, deuda: DeudaUpdate) -> Optional[Deuda]:
    """Actualizar deuda"""
    db_deuda = get_deuda_by_id(db, deuda_id)
    if not db_deuda:
        return None
    
    update_data = deuda.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_deuda, field, value)
    
    db.commit()
    db.refresh(db_deuda)
    return db_deuda


def delete_deuda(db: Session, deuda_id: int) -> bool:
    """Eliminar deuda"""
    db_deuda = get_deuda_by_id(db, deuda_id)
    if not db_deuda:
        return False
    
    db.delete(db_deuda)
    db.commit()
    return True
