"""
Rutas de Deudas
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.deuda import DeudaCreate, DeudaUpdate, DeudaResponse
from app.api.controllers import deudas as controller

router = APIRouter(prefix="/deudas", tags=["deudas"])


@router.get("/")
def get_deudas(db: Session = Depends(get_db)):
    """Obtener todas las deudas"""
    deudas = controller.get_all_deudas(db)
    deudas_response = [DeudaResponse.model_validate(deuda) for deuda in deudas]
    return {"success": True, "data": deudas_response}


@router.get("/{deuda_id}")
def get_deuda(deuda_id: int, db: Session = Depends(get_db)):
    """Obtener deuda por ID"""
    deuda = controller.get_deuda_by_id(db, deuda_id)
    if not deuda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deuda con ID {deuda_id} no encontrada"
        )
    deuda_response = DeudaResponse.model_validate(deuda)
    return {"success": True, "data": deuda_response}


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_deuda(deuda: DeudaCreate, db: Session = Depends(get_db)):
    """Crear nueva deuda"""
    new_deuda = controller.create_deuda(db, deuda)
    deuda_response = DeudaResponse.model_validate(new_deuda)
    return {"success": True, "data": deuda_response, "message": "Deuda creada exitosamente"}


@router.put("/{deuda_id}")
def update_deuda(deuda_id: int, deuda: DeudaUpdate, db: Session = Depends(get_db)):
    """Actualizar deuda"""
    updated_deuda = controller.update_deuda(db, deuda_id, deuda)
    if not updated_deuda:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deuda con ID {deuda_id} no encontrada"
        )
    deuda_response = DeudaResponse.model_validate(updated_deuda)
    return {"success": True, "data": deuda_response, "message": "Deuda actualizada exitosamente"}


@router.delete("/{deuda_id}")
def delete_deuda(deuda_id: int, db: Session = Depends(get_db)):
    """Eliminar deuda"""
    deleted = controller.delete_deuda(db, deuda_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deuda con ID {deuda_id} no encontrada"
        )
    return {"success": True, "message": "Deuda eliminada exitosamente"}
