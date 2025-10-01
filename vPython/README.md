# Money Monitor - Versión Python 🐍

Sistema de gestión de gastos personales con backend en Python/FastAPI y frontend en React/TypeScript.

## 📦 Estructura del Proyecto

```
vPython/
├── backend/              # API FastAPI (Python)
│   ├── app/
│   │   ├── api/         # Rutas y controladores
│   │   ├── core/        # Configuración
│   │   ├── db/          # Base de datos
│   │   ├── models/      # Modelos SQLAlchemy
│   │   ├── schemas/     # Schemas Pydantic
│   │   └── main.py      # App principal
│   ├── alembic/         # Migraciones
│   ├── requirements.txt
│   └── README.md
│
└── frontend-web/        # Aplicación React (TypeScript)
    ├── src/
    │   ├── components/
    │   ├── screens/
    │   ├── contexts/
    │   └── services/
    ├── package.json
    └── README.md
```

## 🚀 Inicio Rápido

### Backend (Python/FastAPI)

```bash
# Entrar al directorio
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env
cp .env.example .env

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload --port 3001
```

### Frontend (React/TypeScript)

```bash
# Entrar al directorio
cd frontend-web

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

## 🔧 Tecnologías

### Backend
- **FastAPI** - Framework web moderno y rápido
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migraciones de base de datos
- **Pydantic** - Validación de datos
- **PostgreSQL** - Base de datos

### Frontend
- **React** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Navegación

## 📊 Diferencias con versión TypeScript

| Aspecto | TypeScript (vTS) | Python (vPython) |
|---------|------------------|------------------|
| Backend Framework | Express.js | FastAPI |
| ORM | Prisma | SQLAlchemy |
| Migraciones | Prisma Migrate | Alembic |
| Validación | Joi + TypeScript | Pydantic |
| Tipo de Servidor | Node.js | Uvicorn/ASGI |
| Documentación API | Manual | Auto (Swagger/ReDoc) |
| Frontend | **Idéntico** | **Idéntico** |

## 🌐 Endpoints API

Todos los endpoints son idénticos a la versión TypeScript:

- `GET /api/gastos` - Listar gastos
- `POST /api/gastos` - Crear gasto
- `GET /api/balance` - Balance
- `GET /api/deudas` - Deudas
- `GET /api/dashboard` - Dashboard
- `GET /api/catalogos` - Catálogos

**Documentación interactiva**: http://localhost:3001/docs

## 🔐 Variables de Entorno

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/money_monitor
SECRET_KEY=your-secret-key
PORT=3001
ENVIRONMENT=development
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Testing

### Backend
```bash
pytest
```

### Frontend
```bash
npm test
```

## 📝 Ventajas de la Versión Python

1. ✅ **Documentación Automática** - Swagger UI out of the box
2. ✅ **Type Safety** - Pydantic para validación robusta
3. ✅ **Async/Await** - Soporte nativo de async
4. ✅ **Performance** - FastAPI es uno de los frameworks más rápidos
5. ✅ **Simplicidad** - Python es más fácil de leer y mantener
6. ✅ **Ecosistema ML** - Fácil integración con ML/AI en el futuro

## 🤝 Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 Licencia

MIT

## 👤 Autor

Paco - Money Monitor Team
