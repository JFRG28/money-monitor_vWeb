# Money Monitor Backend

Backend API para el sistema de gestión de gastos personales Money Monitor.

## 🚀 Características

- **API REST** completa para gestión de gastos
- **Base de datos PostgreSQL** con Prisma ORM
- **Validación de datos** con Joi
- **Rate limiting** y seguridad con Helmet
- **TypeScript** para type safety
- **Documentación automática** de endpoints

## 📋 Endpoints Disponibles

### Gastos
- `GET /api/gastos` - Listar gastos con filtros
- `GET /api/gastos/msi-mci` - Gastos MSI/MCI
- `GET /api/gastos/:id` - Obtener gasto por ID
- `POST /api/gastos` - Crear nuevo gasto
- `PUT /api/gastos/:id` - Actualizar gasto
- `DELETE /api/gastos/:id` - Eliminar gasto

### Dashboard
- `GET /api/dashboard` - Datos del dashboard

### Balance
- `GET /api/balance` - Listar balance de cuentas
- `POST /api/balance` - Crear item de balance
- `PUT /api/balance/:id` - Actualizar balance
- `DELETE /api/balance/:id` - Eliminar balance

### Deudas
- `GET /api/deudas` - Listar deudas
- `POST /api/deudas` - Crear deuda
- `PUT /api/deudas/:id` - Actualizar deuda
- `DELETE /api/deudas/:id` - Eliminar deuda

### Catálogos
- `GET /api/catalogos/tipos-gasto` - Tipos de gasto
- `GET /api/catalogos/formas-pago` - Formas de pago
- `GET /api/catalogos/categorias` - Categorías

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Configurar base de datos:**
   ```bash
   # Generar cliente Prisma
   npm run db:generate
   
   # Crear base de datos
   npm run db:push
   
   # Poblar con datos iniciales
   npm run db:seed
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

## 📊 Base de Datos

### Esquema Principal

- **Gastos**: Tabla principal con todos los gastos
- **Balance**: Balance de cuentas
- **Deudas**: Gestión de deudas
- **Catálogos**: Tipos de gasto, formas de pago, categorías

### Migraciones

```bash
# Crear nueva migración
npm run db:migrate

# Aplicar migraciones
npm run db:push

# Ver base de datos
npm run db:studio
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en desarrollo
- `npm run build` - Compilar TypeScript
- `npm run start` - Ejecutar en producción
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar esquema con DB
- `npm run db:migrate` - Crear migración
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Poblar DB con datos iniciales

## 🌐 Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/money_monitor"

# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📝 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   └── index.ts         # Punto de entrada
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos iniciales
└── package.json
```

## 🔒 Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: Límite de requests
- **Validación**: Validación de entrada con Joi
- **TypeScript**: Type safety en tiempo de compilación

## 🚀 Despliegue

1. **Compilar:**
   ```bash
   npm run build
   ```

2. **Ejecutar:**
   ```bash
   npm start
   ```

3. **Variables de entorno de producción:**
   - Configurar `DATABASE_URL` de producción
   - Configurar `JWT_SECRET` seguro
   - Configurar `CORS_ORIGIN` para el frontend
