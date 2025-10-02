"""
Rutas de Balance
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.balance import BalanceCreate, BalanceUpdate, BalanceResponse
from app.api.controllers import balance as controller

router = APIRouter(prefix="/balance", tags=["balance"])


@router.get("/")
def get_balance(db: Session = Depends(get_db)):
    """Obtener todos los balances"""
    balances = controller.get_all_balance(db)
    balances_response = []
    for balance in balances:
        balance_dict = balance.__dict__.copy()
        balance_dict['tipo'] = controller.convert_tipo_to_long(balance.tipo)
        balances_response.append(BalanceResponse.model_validate(balance_dict))
    return {"success": True, "data": balances_response}


@router.get("/{balance_id}")
def get_balance_by_id(balance_id: int, db: Session = Depends(get_db)):
    """Obtener balance por ID"""
    balance = controller.get_balance_by_id(db, balance_id)
    if not balance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Balance con ID {balance_id} no encontrado"
        )
    balance_dict = balance.__dict__.copy()
    balance_dict['tipo'] = controller.convert_tipo_to_long(balance.tipo)
    balance_response = BalanceResponse.model_validate(balance_dict)
    return {"success": True, "data": balance_response}


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_balance(balance: BalanceCreate, db: Session = Depends(get_db)):
    """Crear nuevo balance"""
    new_balance = controller.create_balance(db, balance)
    balance_dict = new_balance.__dict__.copy()
    balance_dict['tipo'] = controller.convert_tipo_to_long(new_balance.tipo)
    balance_response = BalanceResponse.model_validate(balance_dict)
    return {"success": True, "data": balance_response, "message": "Balance creado exitosamente"}


@router.put("/{balance_id}")
def update_balance(balance_id: int, balance: BalanceUpdate, db: Session = Depends(get_db)):
    """Actualizar balance"""
    updated_balance = controller.update_balance(db, balance_id, balance)
    if not updated_balance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Balance con ID {balance_id} no encontrado"
        )
    balance_dict = updated_balance.__dict__.copy()
    balance_dict['tipo'] = controller.convert_tipo_to_long(updated_balance.tipo)
    balance_response = BalanceResponse.model_validate(balance_dict)
    return {"success": True, "data": balance_response, "message": "Balance actualizado exitosamente"}


@router.delete("/{balance_id}")
def delete_balance(balance_id: int, db: Session = Depends(get_db)):
    """Eliminar balance"""
    deleted = controller.delete_balance(db, balance_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Balance con ID {balance_id} no encontrado"
        )
    return {"success": True, "message": "Balance eliminado exitosamente"}
