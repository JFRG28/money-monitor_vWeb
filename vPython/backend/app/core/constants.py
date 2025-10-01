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
    'BBVA Oro',
    'Klar Platino',
    'Mercado Pago',
    'Santander Free',
    'No aplica',
    'Efectivo',
    'Transferencia',
    'TDD NU',
    'TDC NU'
]
FormaPago = Literal[
    'BBVA Oro',
    'Klar Platino',
    'Mercado Pago',
    'Santander Free',
    'No aplica',
    'Efectivo',
    'Transferencia',
    'TDD NU',
    'TDC NU'
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

# Tags
TAGS = [
    'D',   # Debo
    'MD',  # Me deben
    'NA'   # No aplica
]
Tag = Literal['D', 'MD', 'NA']

# Descripciones de tags (para mostrar en UI)
TAG_LABELS = {
    'D': 'Debo',
    'MD': 'Me deben',
    'NA': 'No aplica'
}

# Gasto por mes (abreviaciones)
GASTO_X_MES = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
    'NA'
]
GastoXMes = Literal['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC', 'NA']
