"""
Rutas de Balance
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.balance import BalanceCreate, BalanceUpdate, BalanceResponse
from app.api.controllers import balance as controller

router = APIRouter(prefix="/balance", tags=["balance"])


@router.get("/", response_model=dict)
def get_balance(db: Session = Depends(get_db)):
    """Obtener todos los balances"""
    balances = controller.get_all_balance(db)
    return {"success": True, "data": balances}


@router.get("/{balance_id}", response_model=dict)
def get_balance_by_id(balance_id: int, db: Session = Depends(get_db)):
    """Obtener balance por ID"""
    balance = controller.get_balance_by_id(db, balance_id)
    if not balance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Balance con ID {balance_id} no encontrado"
        )
    return {"success": True, "data": balance}


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_balance(balance: BalanceCreate, db: Session = Depends(get_db)):
    """Crear nuevo balance"""
    new_balance = controller.create_balance(db, balance)
    return {"success": True, "data": new_balance, "message": "Balance creado exitosamente"}


@router.put("/{balance_id}", response_model=dict)
def update_balance(balance_id: int, balance: BalanceUpdate, db: Session = Depends(get_db)):
    """Actualizar balance"""
    updated_balance = controller.update_balance(db, balance_id, balance)
    if not updated_balance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Balance con ID {balance_id} no encontrado"
        )
    return {"success": True, "data": updated_balance, "message": "Balance actualizado exitosamente"}


@router.delete("/{balance_id}", response_model=dict)
def delete_balance(balance_id: int, db: Session = Depends(get_db)):
    """Eliminar balance"""
    deleted = controller.delete_balance(db, balance_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Balance con ID {balance_id} no encontrado"
        )
    return {"success": True, "message": "Balance eliminado exitosamente"}
