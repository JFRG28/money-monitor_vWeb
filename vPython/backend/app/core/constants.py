"""
Catálogos de la aplicación Money Monitor
Valores estables que no requieren tabla en BD
"""
from typing import Literal

# Tipos de gasto
TIPOS_GASTO = ['Fijo', 'Variable', 'MSI', 'MCI']
TipoGasto = Literal['Fijo', 'Variable', 'MSI', 'MCI']

# Categorías
CATEGORIAS = ['E', 'I']  # Egreso, Ingreso
Categoria = Literal['E', 'I']

# Formas de pago
FORMAS_PAGO = [
    'Efectivo',
    'Tarjeta Débito',
    'Tarjeta Crédito',
    'Transferencia',
    'PayPal',
    'Otro'
]
FormaPago = Literal[
    'Efectivo',
    'Tarjeta Débito',
    'Tarjeta Crédito',
    'Transferencia',
    'PayPal',
    'Otro'
]

# Meses
MESES = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]
Mes = Literal[
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]
