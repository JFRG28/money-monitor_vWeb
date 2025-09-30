# 💰 Money Monitor

Sistema completo de gestión de gastos personales desarrollado con React Native + Node.js, diseñado para ser la base de aplicaciones web, Android e iOS.

## 🎯 Características Principales

- **📊 Dashboard Interactivo** - Resumen financiero completo
- **💳 Gestión de Gastos** - Registro y categorización de gastos
- **📈 Balance de Cuentas** - Control de debe y crédito
- **💸 Gestión de Deudas** - Seguimiento de obligaciones
- **🔍 Filtros Avanzados** - Búsqueda y filtrado de datos
- **📱 Responsive Design** - Optimizado para todos los dispositivos
- **🔄 API REST** - Backend escalable y documentado

## 🏗️ Arquitectura

### Backend (Node.js + Express + Prisma)
```
backend/
├── src/
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   └── index.ts         # Punto de entrada
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos iniciales
└── package.json
```

### Frontend Web (React + TypeScript)
```
frontend-web/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── screens/         # Pantallas de la app
│   ├── contexts/        # Estado global
│   ├── services/        # Cliente API
│   ├── types/           # Tipos TypeScript
│   └── constants/       # Constantes
└── package.json
```

### Código Compartido
```
shared/
├── types/               # Tipos TypeScript compartidos
├── constants/           # Constantes compartidas
└── utils/               # Utilidades comunes
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd money-monitor_vWeb
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp env.example .env
# Editar .env con tu configuración de base de datos
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend-web
npm install
cp env.example .env
# Editar .env con la URL del backend
npm start
```

### 4. Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📊 Base de Datos

### Esquema Principal
- **Gastos**: Tabla principal con todos los gastos
- **Balance**: Balance de cuentas (Debe/Crédito)
- **Deudas**: Gestión de deudas y obligaciones
- **Catálogos**: Tipos de gasto, formas de pago, categorías

### Migraciones
```bash
# Crear migración
npm run db:migrate

# Aplicar cambios
npm run db:push

# Ver base de datos
npm run db:studio
```

## 🌐 API Endpoints

### Gastos
- `GET /api/gastos` - Listar gastos con filtros
- `POST /api/gastos` - Crear nuevo gasto
- `PUT /api/gastos/:id` - Actualizar gasto
- `DELETE /api/gastos/:id` - Eliminar gasto
- `GET /api/gastos/msi-mci` - Gastos MSI/MCI

### Dashboard
- `GET /api/dashboard` - Datos del dashboard

### Balance
- `GET /api/balance` - Listar balance
- `POST /api/balance` - Crear item de balance
- `PUT /api/balance/:id` - Actualizar balance
- `DELETE /api/balance/:id` - Eliminar balance

### Deudas
- `GET /api/deudas` - Listar deudas
- `POST /api/deudas` - Crear deuda
- `PUT /api/deudas/:id` - Actualizar deuda
- `DELETE /api/deudas/:id` - Eliminar deuda

## 📱 Pantallas de la Aplicación

### 🏠 Dashboard
- Resumen financiero general
- Cards con totales y balances
- Gráficos de gastos por tipo
- Tabla de gastos por mes

### 💰 Gestión de Gastos
- Lista completa con filtros
- Formulario de creación/edición
- Búsqueda por concepto
- Filtros avanzados

### 📊 Balance de Cuentas
- Control de debe y crédito
- Balance neto calculado
- Gestión de items de balance

### 💳 Gestión de Deudas
- Registro de deudas
- Separación por tipo
- Total de deudas

### ⚙️ Configuración
- Perfil de usuario
- Preferencias de notificaciones
- Configuración del sistema

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Type safety
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **Joi** - Validación de datos
- **Helmet** - Seguridad
- **CORS** - Origen cruzado

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Framework de CSS
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones
- **Heroicons** - Iconos

## 🚀 Roadmap

### Fase 1: Web App (✅ Completado)
- [x] Backend API completo
- [x] Frontend web funcional
- [x] Dashboard interactivo
- [x] Gestión de gastos
- [x] Base de datos configurada

### Fase 2: Mobile App (🔄 Próximo)
- [ ] Configurar React Native
- [ ] Adaptar componentes para mobile
- [ ] Navegación nativa
- [ ] Sincronización offline

### Fase 3: Mejoras (📋 Planificado)
- [ ] Autenticación de usuarios
- [ ] Exportación a Excel/PDF
- [ ] Gráficos interactivos
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)

## 📝 Estructura del Proyecto

```
money-monitor_vWeb/
├── backend/                 # API Backend
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend-web/           # Aplicación Web
│   ├── src/
│   └── package.json
├── shared/                 # Código Compartido
│   ├── types/
│   ├── constants/
│   └── utils/
└── README.md
```

## 🔒 Seguridad

- **Helmet** para headers de seguridad
- **CORS** configurado correctamente
- **Rate Limiting** para prevenir abuso
- **Validación** de entrada con Joi
- **TypeScript** para type safety

## 📊 Monitoreo

- **Health Check** endpoint
- **Logging** con Morgan
- **Error Handling** centralizado
- **Rate Limiting** configurado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Paco** - [fgrodriguez.28@gmail.com](mailto:fgrodriguez.28@gmail.com)

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca de UI
- [Node.js](https://nodejs.org/) - Runtime de JavaScript
- [Prisma](https://prisma.io/) - ORM para base de datos
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Heroicons](https://heroicons.com/) - Iconos SVG

---

⭐ **¡Dale una estrella si te gusta este proyecto!** ⭐
