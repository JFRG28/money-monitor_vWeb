"""
Controlador de Balance
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.balance import Balance
from app.schemas.balance import BalanceCreate, BalanceUpdate


def convert_tipo_to_short(tipo: str) -> str:
    """Convertir tipo de formato largo a corto para almacenamiento"""
    tipo_mapping = {
        "Débito": "D",
        "Inversión": "I",
        "D": "D",
        "I": "I"
    }
    return tipo_mapping.get(tipo, tipo)


def convert_tipo_to_long(tipo: str) -> str:
    """Convertir tipo de formato corto a largo para respuesta"""
    tipo_mapping = {
        "D": "Débito",
        "I": "Inversión"
    }
    return tipo_mapping.get(tipo, tipo)


def get_all_balance(db: Session) -> List[Balance]:
    """Obtener todos los balances"""
    return db.query(Balance).all()


def get_balance_by_id(db: Session, balance_id: int) -> Optional[Balance]:
    """Obtener balance por ID"""
    return db.query(Balance).filter(Balance.id == balance_id).first()


def create_balance(db: Session, balance: BalanceCreate) -> Balance:
    """Crear nuevo balance"""
    balance_data = balance.model_dump()
    # Convertir tipo a formato corto para almacenamiento
    balance_data['tipo'] = convert_tipo_to_short(balance_data['tipo'])
    # Calcular diferencia automáticamente
    balance_data['diferencia'] = float(balance_data['monto']) - float(balance_data['deben_ser'])
    
    db_balance = Balance(**balance_data)
    db.add(db_balance)
    db.commit()
    db.refresh(db_balance)
    return db_balance


def update_balance(db: Session, balance_id: int, balance: BalanceUpdate) -> Optional[Balance]:
    """Actualizar balance"""
    db_balance = get_balance_by_id(db, balance_id)
    if not db_balance:
        return None
    
    update_data = balance.model_dump(exclude_unset=True)
    
    # Convertir tipo si se está actualizando
    if 'tipo' in update_data:
        update_data['tipo'] = convert_tipo_to_short(update_data['tipo'])
    
    for field, value in update_data.items():
        setattr(db_balance, field, value)
    
    # Recalcular diferencia si se actualizó monto o deben_ser
    if 'monto' in update_data or 'deben_ser' in update_data:
        db_balance.diferencia = float(db_balance.monto) - float(db_balance.deben_ser)
    
    db.commit()
    db.refresh(db_balance)
    return db_balance


def delete_balance(db: Session, balance_id: int) -> bool:
    """Eliminar balance"""
    db_balance = get_balance_by_id(db, balance_id)
    if not db_balance:
        return False
    
    db.delete(db_balance)
    db.commit()
    return True
