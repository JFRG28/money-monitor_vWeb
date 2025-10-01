"""
Rutas de Dashboard
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.base import get_db
from app.models.gasto import Gasto

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=dict)
def get_dashboard_data(db: Session = Depends(get_db)):
    """Obtener datos del dashboard"""
    
    # Total de gastos
    total_gastos = db.query(func.sum(Gasto.monto)).scalar() or 0
    
    # Gastos por tipo
    gastos_por_tipo = db.query(
        Gasto.tipo_gasto,
        func.sum(Gasto.monto).label('total')
    ).group_by(Gasto.tipo_gasto).all()
    
    # Gastos por categoría
    gastos_por_categoria = db.query(
        Gasto.categoria,
        func.sum(Gasto.monto).label('total')
    ).group_by(Gasto.categoria).all()
    
    # Gastos por mes
    gastos_por_mes = db.query(
        Gasto.mes,
        func.sum(Gasto.monto).label('total')
    ).group_by(Gasto.mes).all()
    
    return {
        "success": True,
        "data": {
            "total_gastos": float(total_gastos),
            "gastos_por_tipo": [
                {"tipo": item[0], "total": float(item[1])}
                for item in gastos_por_tipo
            ],
            "gastos_por_categoria": [
                {"categoria": item[0], "total": float(item[1])}
                for item in gastos_por_categoria
            ],
            "gastos_por_mes": [
                {"mes": item[0], "total": float(item[1])}
                for item in gastos_por_mes
            ]
        }
    }
