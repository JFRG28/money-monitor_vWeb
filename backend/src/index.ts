import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importar rutas
import gastosRoutes from './routes/gastos';
import dashboardRoutes from './routes/dashboard';
import balanceRoutes from './routes/balance';
import deudasRoutes from './routes/deudas';
import catalogosRoutes from './routes/catalogos';

// Importar middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Cargar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();
const PORT = process.env.PORT || 3001;

// Crear instancia de Prisma
export const prisma = new PrismaClient();

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/gastos', gastosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/deudas', deudasRoutes);
app.use('/api/catalogos', catalogosRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api`);
      console.log(`🏥 Health check en http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar servidor
startServer();
