# Money Monitor Backend - Python/FastAPI

Backend API para Money Monitor - Sistema de gestión de gastos personales, implementado en Python con FastAPI.

## 🐍 Stack Tecnológico

- **Framework**: FastAPI 0.109+
- **Base de Datos**: PostgreSQL con SQLAlchemy
- **Migraciones**: Alembic
- **Validación**: Pydantic
- **Servidor**: Uvicorn

## 📋 Requisitos Previos

- Python 3.11+
- PostgreSQL 14+
- pip o poetry

## 🚀 Instalación

### 1. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # En Linux/Mac
# o
venv\Scripts\activate  # En Windows
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 4. Crear base de datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE money_monitor;
CREATE USER admin WITH PASSWORD 'admin_moneymonitor2.28';
GRANT ALL PRIVILEGES ON DATABASE money_monitor TO admin;
```

### 5. Ejecutar migraciones

```bash
# Crear migración inicial
alembic revision --autogenerate -m "Initial migration"

# Aplicar migraciones
alembic upgrade head
```

## 🏃 Ejecutar Servidor

### Modo desarrollo

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 3001
```

### Modo producción

```bash
uvicorn app.main:app --host 0.0.0.0 --port 3001 --workers 4
```

### Usando Python directamente

```bash
python -m app.main
```

## 📚 Documentación API

Una vez que el servidor esté corriendo, puedes acceder a:

- **Swagger UI**: http://localhost:3001/docs
- **ReDoc**: http://localhost:3001/redoc
- **Health Check**: http://localhost:3001/api/health

## 🗂️ Estructura del Proyecto

```
backend/
├── alembic/                 # Migraciones de base de datos
│   ├── versions/           # Archivos de migración
│   └── env.py             # Configuración de Alembic
├── app/
│   ├── api/
│   │   ├── routes/        # Rutas de FastAPI
│   │   └── controllers/   # Lógica de negocio
│   ├── core/              # Configuración y constantes
│   ├── db/                # Conexión a base de datos
│   ├── models/            # Modelos SQLAlchemy
│   ├── schemas/           # Schemas Pydantic
│   ├── middleware/        # Middlewares personalizados
│   └── main.py           # Aplicación principal
├── requirements.txt       # Dependencias
├── alembic.ini           # Configuración de Alembic
└── .env.example          # Variables de entorno ejemplo
```

## 🔄 Migraciones

### Crear nueva migración

```bash
alembic revision --autogenerate -m "Descripción del cambio"
```

### Aplicar migraciones

```bash
alembic upgrade head
```

### Revertir migración

```bash
alembic downgrade -1
```

### Ver historial

```bash
alembic history
```

## 📝 Comandos Útiles

### Formatear código

```bash
black app/
```

### Linting

```bash
flake8 app/
```

### Type checking

```bash
mypy app/
```

### Tests

```bash
pytest
```

## 🌐 Endpoints Principales

### Gastos
- `GET /api/gastos` - Listar gastos con filtros
- `GET /api/gastos/{id}` - Obtener gasto por ID
- `POST /api/gastos` - Crear gasto
- `PUT /api/gastos/{id}` - Actualizar gasto
- `DELETE /api/gastos/{id}` - Eliminar gasto

### Balance
- `GET /api/balance` - Listar balances
- `POST /api/balance` - Crear balance

### Deudas
- `GET /api/deudas` - Listar deudas
- `POST /api/deudas` - Crear deuda

### Dashboard
- `GET /api/dashboard` - Obtener datos del dashboard

### Catálogos
- `GET /api/catalogos` - Obtener todos los catálogos
- `GET /api/catalogos/tipos-gasto` - Tipos de gasto
- `GET /api/catalogos/categorias` - Categorías
- `GET /api/catalogos/formas-pago` - Formas de pago

## 🔐 Seguridad

- CORS configurado para orígenes específicos
- Rate limiting implementado
- Validación de datos con Pydantic
- Manejo de errores centralizado

## 📊 Base de Datos

### Modelos principales:
- **Gasto**: Gastos y egresos
- **Balance**: Balance de cuentas
- **Deuda**: Registro de deudas

## 🐛 Debugging

Para habilitar logs detallados:

```python
# En .env
ENVIRONMENT=development
```

## 📦 Despliegue

### Docker (opcional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3001"]
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT

## 👤 Autor

Paco - Money Monitor Team
