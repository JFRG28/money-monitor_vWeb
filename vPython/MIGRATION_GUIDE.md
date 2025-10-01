# Guía de Migración: TypeScript → Python

Esta guía explica las equivalencias entre la versión TypeScript (vTS) y Python (vPython) del proyecto Money Monitor.

## 📋 Tabla de Equivalencias

### Frameworks y Herramientas

| TypeScript (vTS) | Python (vPython) | Propósito |
|-----------------|------------------|-----------|
| Express.js | FastAPI | Framework web |
| Prisma | SQLAlchemy + Alembic | ORM y migraciones |
| Joi | Pydantic | Validación de datos |
| TypeScript | Python Type Hints | Tipado estático |
| ts-node | Python interpreter | Ejecutor |
| nodemon | uvicorn --reload | Auto-reload |
| npm/yarn | pip/poetry | Gestor de paquetes |

### Archivos de Configuración

| TypeScript | Python | Descripción |
|-----------|--------|-------------|
| `package.json` | `requirements.txt` | Dependencias |
| `tsconfig.json` | `pyproject.toml` (opcional) | Configuración |
| `.env` | `.env` | Variables de entorno |
| `prisma/schema.prisma` | `app/models/*.py` | Definición de modelos |

### Estructura de Carpetas

#### TypeScript (vTS)
```
backend/
├── src/
│   ├── index.ts
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── types/
│   └── constants/
└── prisma/
    └── schema.prisma
```

#### Python (vPython)
```
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── routes/
│   │   └── controllers/
│   ├── models/
│   ├── schemas/
│   ├── middleware/
│   └── core/
└── alembic/
    └── versions/
```

## 🔄 Equivalencias de Código

### 1. Definición de Modelos

**TypeScript (Prisma)**
```typescript
model Gasto {
  id           Int      @id @default(autoincrement())
  concepto     String
  monto        Decimal  @db.Decimal(10, 2)
  tipo_gasto   String
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}
```

**Python (SQLAlchemy)**
```python
class Gasto(Base):
    __tablename__ = "gastos"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    concepto = Column(String, nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    tipo_gasto = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### 2. Validación de Datos

**TypeScript (Joi)**
```typescript
const gastoSchema = Joi.object({
  concepto: Joi.string().required(),
  monto: Joi.number().positive().required(),
  tipo_gasto: Joi.string().valid('Fijo', 'Variable', 'MSI', 'MCI').required()
});
```

**Python (Pydantic)**
```python
class GastoCreate(BaseModel):
    concepto: str = Field(..., min_length=1)
    monto: Decimal = Field(..., gt=0)
    tipo_gasto: Literal['Fijo', 'Variable', 'MSI', 'MCI']
```

### 3. Rutas/Endpoints

**TypeScript (Express)**
```typescript
router.get('/gastos', async (req, res) => {
  const gastos = await prisma.gasto.findMany();
  res.json({ success: true, data: gastos });
});

router.post('/gastos', validateGasto, async (req, res) => {
  const gasto = await prisma.gasto.create({ data: req.body });
  res.status(201).json({ success: true, data: gasto });
});
```

**Python (FastAPI)**
```python
@router.get("/gastos", response_model=dict)
def get_gastos(db: Session = Depends(get_db)):
    gastos = db.query(Gasto).all()
    return {"success": True, "data": gastos}

@router.post("/gastos", response_model=dict, status_code=201)
def create_gasto(gasto: GastoCreate, db: Session = Depends(get_db)):
    db_gasto = Gasto(**gasto.model_dump())
    db.add(db_gasto)
    db.commit()
    return {"success": True, "data": db_gasto}
```

### 4. Middleware

**TypeScript (Express)**
```typescript
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(helmet());
```

**Python (FastAPI)**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. Manejo de Errores

**TypeScript**
```typescript
try {
  const gasto = await prisma.gasto.findUnique({ where: { id } });
  if (!gasto) {
    return res.status(404).json({ error: "No encontrado" });
  }
  res.json({ data: gasto });
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

**Python**
```python
gasto = db.query(Gasto).filter(Gasto.id == gasto_id).first()
if not gasto:
    raise HTTPException(
        status_code=404,
        detail="No encontrado"
    )
return {"data": gasto}
```

## 🚀 Comandos Equivalentes

### Instalación

| TypeScript | Python |
|-----------|--------|
| `npm install` | `pip install -r requirements.txt` |
| `npm run build` | N/A (Python no requiere compilación) |

### Desarrollo

| TypeScript | Python |
|-----------|--------|
| `npm run dev` | `uvicorn app.main:app --reload` |
| `npm start` | `python run.py` |
| `npm test` | `pytest` |

### Base de Datos

| TypeScript (Prisma) | Python (Alembic) |
|--------------------|------------------|
| `prisma generate` | N/A |
| `prisma db push` | `alembic upgrade head` |
| `prisma migrate dev` | `alembic revision --autogenerate -m "mensaje"` |
| `prisma migrate deploy` | `alembic upgrade head` |
| `prisma studio` | N/A (usar DBeaver, pgAdmin, etc.) |

### Linting/Formateo

| TypeScript | Python |
|-----------|--------|
| `eslint` | `flake8` |
| `prettier` | `black` |
| `tsc --noEmit` | `mypy` |

## 📊 Ventajas y Desventajas

### Python (vPython)

**Ventajas:**
- ✅ Documentación automática (Swagger/ReDoc)
- ✅ Type hints nativos en el lenguaje
- ✅ Sintaxis más limpia y legible
- ✅ Mejor para data science/ML en el futuro
- ✅ Async/await nativo y eficiente
- ✅ Comunidad grande de científicos de datos

**Desventajas:**
- ❌ ORM menos maduro que Prisma
- ❌ Requiere más configuración inicial
- ❌ Migraciones manuales con Alembic
- ❌ No tiene Prisma Studio

### TypeScript (vTS)

**Ventajas:**
- ✅ Prisma es muy potente y fácil de usar
- ✅ Prisma Studio para ver datos
- ✅ Ecosistema Node.js maduro
- ✅ Same language (TS) en frontend y backend

**Desventajas:**
- ❌ Más verboso en validaciones
- ❌ Documentación API manual
- ❌ Menos natural para operaciones de datos

## 🔄 Cómo Migrar Código Existente

### Paso 1: Convertir Modelos
1. Copiar `schema.prisma`
2. Traducir a clases SQLAlchemy
3. Crear esquemas Pydantic

### Paso 2: Convertir Controladores
1. Cambiar imports de Prisma a SQLAlchemy
2. Adaptar queries de Prisma a SQLAlchemy
3. Usar `Session` en lugar de `prisma`

### Paso 3: Convertir Rutas
1. Cambiar de Express Router a FastAPI Router
2. Adaptar decoradores `@app.get()` etc.
3. Usar `Depends()` para inyección de dependencias

### Paso 4: Migraciones
1. Ejecutar `alembic revision --autogenerate`
2. Revisar migración generada
3. Aplicar con `alembic upgrade head`

## 🧪 Testing

### TypeScript
```typescript
// Jest/Mocha
describe('GET /gastos', () => {
  it('should return all gastos', async () => {
    const response = await request(app).get('/api/gastos');
    expect(response.status).toBe(200);
  });
});
```

### Python
```python
# pytest
def test_get_gastos(client):
    response = client.get("/api/gastos")
    assert response.status_code == 200
    assert "data" in response.json()
```

## 📚 Recursos

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
- [Pydantic Docs](https://docs.pydantic.dev/)

## 🤝 Soporte

Si tienes dudas sobre la migración, consulta:
1. Esta guía
2. README de cada versión
3. Código de ejemplo en ambas carpetas
