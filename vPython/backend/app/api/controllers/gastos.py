"""
Controlador de Gastos
"""
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.gasto import Gasto
from app.schemas.gasto import GastoCreate, GastoUpdate


def get_gastos_by_filters(
    db: Session,
    tipo_gasto: Optional[List[str]] = None,
    categoria: Optional[List[str]] = None,
    forma_pago: Optional[List[str]] = None,
    mes: Optional[List[str]] = None,
    anio: Optional[int] = None,
    fecha_desde: Optional[str] = None,
    fecha_hasta: Optional[str] = None,
    a_pagos: Optional[bool] = None,
    se_divide: Optional[bool] = None,
    tag: Optional[str] = None,
    skip: int = 0,
    limit: int = 20
) -> tuple[List[Gasto], int]:
    """Obtener gastos con filtros"""
    query = db.query(Gasto)
    
    # Aplicar filtros
    filters = []
    
    if tipo_gasto:
        filters.append(Gasto.tipo_gasto.in_(tipo_gasto))
    
    if categoria:
        filters.append(Gasto.categoria.in_(categoria))
    
    if forma_pago:
        filters.append(Gasto.forma_pago.in_(forma_pago))
    
    if mes:
        filters.append(Gasto.mes.in_(mes))
    
    if anio:
        filters.append(Gasto.anio == anio)
    
    if fecha_desde:
        filters.append(Gasto.fecha_cargo >= fecha_desde)
    
    if fecha_hasta:
        filters.append(Gasto.fecha_cargo <= fecha_hasta)
    
    if a_pagos is not None:
        filters.append(Gasto.a_pagos == a_pagos)
    
    if se_divide is not None:
        filters.append(Gasto.se_divide == se_divide)
    
    if tag:
        filters.append(Gasto.tag == tag)
    
    if filters:
        query = query.filter(and_(*filters))
    
    # Obtener total
    total = query.count()
    
    # Aplicar paginación y ordenar
    gastos = query.order_by(Gasto.fecha_cargo.desc()).offset(skip).limit(limit).all()
    
    return gastos, total


def get_gasto_by_id(db: Session, gasto_id: int) -> Optional[Gasto]:
    """Obtener gasto por ID"""
    return db.query(Gasto).filter(Gasto.id == gasto_id).first()


def create_gasto(db: Session, gasto: GastoCreate) -> Gasto:
    """Crear nuevo gasto"""
    db_gasto = Gasto(**gasto.model_dump())
    db.add(db_gasto)
    db.commit()
    db.refresh(db_gasto)
    return db_gasto


def update_gasto(db: Session, gasto_id: int, gasto: GastoUpdate) -> Optional[Gasto]:
    """Actualizar gasto"""
    db_gasto = get_gasto_by_id(db, gasto_id)
    if not db_gasto:
        return None
    
    update_data = gasto.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_gasto, field, value)
    
    db.commit()
    db.refresh(db_gasto)
    return db_gasto


def delete_gasto(db: Session, gasto_id: int) -> bool:
    """Eliminar gasto"""
    db_gasto = get_gasto_by_id(db, gasto_id)
    if not db_gasto:
        return False
    
    db.delete(db_gasto)
    db.commit()
    return True


def get_gastos_msi_mci(db: Session) -> List[Gasto]:
    """Obtener gastos MSI/MCI"""
    return db.query(Gasto).filter(
        or_(Gasto.tipo_gasto == 'MSI', Gasto.tipo_gasto == 'MCI')
    ).order_by(Gasto.fecha_cargo.desc()).all()
