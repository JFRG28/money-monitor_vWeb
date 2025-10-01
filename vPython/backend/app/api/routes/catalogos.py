"""
Rutas de Catálogos
"""
from fastapi import APIRouter
from app.core.constants import TIPOS_GASTO, CATEGORIAS, FORMAS_PAGO, MESES, TAGS, TAG_LABELS, GASTO_X_MES

router = APIRouter(prefix="/catalogos", tags=["catalogos"])


@router.get("/", response_model=dict)
def get_catalogos():
    """Obtener todos los catálogos"""
    return {
        "success": True,
        "data": {
            "tipos_gasto": TIPOS_GASTO,
            "categorias": CATEGORIAS,
            "formas_pago": FORMAS_PAGO,
            "meses": MESES,
            "tags": TAGS,
            "tag_labels": TAG_LABELS,
            "gasto_x_mes": GASTO_X_MES
        }
    }


@router.get("/tipos-gasto", response_model=dict)
def get_tipos_gasto():
    """Obtener catálogo de tipos de gasto"""
    return {"success": True, "data": TIPOS_GASTO}


@router.get("/categorias", response_model=dict)
def get_categorias():
    """Obtener catálogo de categorías"""
    return {"success": True, "data": CATEGORIAS}


@router.get("/formas-pago", response_model=dict)
def get_formas_pago():
    """Obtener catálogo de formas de pago"""
    return {"success": True, "data": FORMAS_PAGO}


@router.get("/meses", response_model=dict)
def get_meses():
    """Obtener catálogo de meses"""
    return {"success": True, "data": MESES}


@router.get("/tags", response_model=dict)
def get_tags():
    """Obtener catálogo de tags"""
    return {"success": True, "data": TAGS, "labels": TAG_LABELS}
