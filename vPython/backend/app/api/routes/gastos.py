"""
Rutas de Gastos
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.gasto import GastoCreate, GastoUpdate, GastoResponse
from app.api.controllers import gastos as controller

router = APIRouter(prefix="/gastos", tags=["gastos"])


@router.get("/", response_model=dict)
def get_gastos(
    tipo_gasto: Optional[List[str]] = Query(None),
    categoria: Optional[List[str]] = Query(None),
    forma_pago: Optional[List[str]] = Query(None),
    mes: Optional[List[str]] = Query(None),
    anio: Optional[int] = Query(None),
    fecha_desde: Optional[str] = Query(None),
    fecha_hasta: Optional[str] = Query(None),
    a_pagos: Optional[bool] = Query(None),
    se_divide: Optional[bool] = Query(None),
    tag: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener gastos con filtros y paginación"""
    skip = (page - 1) * limit
    
    gastos, total = controller.get_gastos_by_filters(
        db=db,
        tipo_gasto=tipo_gasto,
        categoria=categoria,
        forma_pago=forma_pago,
        mes=mes,
        anio=anio,
        fecha_desde=fecha_desde,
        fecha_hasta=fecha_hasta,
        a_pagos=a_pagos,
        se_divide=se_divide,
        tag=tag,
        skip=skip,
        limit=limit
    )
    
    return {
        "success": True,
        "data": gastos,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit - 1) // limit
        }
    }


@router.get("/msi-mci", response_model=dict)
def get_gastos_msi_mci(db: Session = Depends(get_db)):
    """Obtener gastos MSI/MCI"""
    gastos = controller.get_gastos_msi_mci(db)
    return {"success": True, "data": gastos}


@router.get("/{gasto_id}", response_model=dict)
def get_gasto(gasto_id: int, db: Session = Depends(get_db)):
    """Obtener gasto por ID"""
    gasto = controller.get_gasto_by_id(db, gasto_id)
    if not gasto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gasto con ID {gasto_id} no encontrado"
        )
    return {"success": True, "data": gasto}


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_gasto(gasto: GastoCreate, db: Session = Depends(get_db)):
    """Crear nuevo gasto"""
    new_gasto = controller.create_gasto(db, gasto)
    return {"success": True, "data": new_gasto, "message": "Gasto creado exitosamente"}


@router.put("/{gasto_id}", response_model=dict)
def update_gasto(gasto_id: int, gasto: GastoUpdate, db: Session = Depends(get_db)):
    """Actualizar gasto"""
    updated_gasto = controller.update_gasto(db, gasto_id, gasto)
    if not updated_gasto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gasto con ID {gasto_id} no encontrado"
        )
    return {"success": True, "data": updated_gasto, "message": "Gasto actualizado exitosamente"}


@router.delete("/{gasto_id}", response_model=dict)
def delete_gasto(gasto_id: int, db: Session = Depends(get_db)):
    """Eliminar gasto"""
    deleted = controller.delete_gasto(db, gasto_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gasto con ID {gasto_id} no encontrado"
        )
    return {"success": True, "message": "Gasto eliminado exitosamente"}
