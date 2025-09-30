import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear tipos de gasto
  const tiposGasto = await Promise.all([
    prisma.tipoGastoItem.upsert({
      where: { id: 'MSI' },
      update: {},
      create: {
        id: 'MSI',
        nombre: 'MSI',
        descripcion: 'Meses Sin Intereses'
      }
    }),
    prisma.tipoGastoItem.upsert({
      where: { id: 'Variable' },
      update: {},
      create: {
        id: 'Variable',
        nombre: 'Variable',
        descripcion: 'Gasto Variable'
      }
    }),
    prisma.tipoGastoItem.upsert({
      where: { id: 'Fijo' },
      update: {},
      create: {
        id: 'Fijo',
        nombre: 'Fijo',
        descripcion: 'Gasto Fijo'
      }
    })
  ]);

  console.log('✅ Tipos de gasto creados');

  // Crear formas de pago
  const formasPago = await Promise.all([
    prisma.formaPagoItem.upsert({
      where: { id: 'BBVA' },
      update: {},
      create: {
        id: 'BBVA',
        nombre: 'BBVA Oro',
        descripcion: 'Tarjeta BBVA Oro'
      }
    }),
    prisma.formaPagoItem.upsert({
      where: { id: 'Klar' },
      update: {},
      create: {
        id: 'Klar',
        nombre: 'Klar Platino',
        descripcion: 'Tarjeta Klar Platino'
      }
    }),
    prisma.formaPagoItem.upsert({
      where: { id: 'MP' },
      update: {},
      create: {
        id: 'MP',
        nombre: 'Mercado Pago',
        descripcion: 'Mercado Pago'
      }
    }),
    prisma.formaPagoItem.upsert({
      where: { id: 'Nu' },
      update: {},
      create: {
        id: 'Nu',
        nombre: 'Nu débito',
        descripcion: 'Tarjeta Nu débito'
      }
    }),
    prisma.formaPagoItem.upsert({
      where: { id: 'Efectivo' },
      update: {},
      create: {
        id: 'Efectivo',
        nombre: 'Efectivo',
        descripcion: 'Pago en efectivo'
      }
    }),
    prisma.formaPagoItem.upsert({
      where: { id: 'TDC' },
      update: {},
      create: {
        id: 'TDC',
        nombre: 'TDC Free',
        descripcion: 'Tarjeta TDC Free'
      }
    })
  ]);

  console.log('✅ Formas de pago creadas');

  // Crear categorías
  const categorias = await Promise.all([
    prisma.categoriaItem.upsert({
      where: { id: 'E' },
      update: {},
      create: {
        id: 'E',
        codigo: 'E',
        descripcion: 'Egreso'
      }
    }),
    prisma.categoriaItem.upsert({
      where: { id: 'I' },
      update: {},
      create: {
        id: 'I',
        codigo: 'I',
        descripcion: 'Ingreso'
      }
    })
  ]);

  console.log('✅ Categorías creadas');

  // Crear algunos gastos de ejemplo
  const gastosEjemplo = [
    {
      concepto: 'Vianney má',
      monto: 867.0,
      tipo_gasto: 'MSI' as const,
      forma_pago: 'BBVA Oro',
      mes: 'Agosto',
      anio: 2025,
      fecha_cargo: new Date('2025-09-01'),
      fecha_pago: new Date('2025-09-01'),
      categoria: 'E' as const,
      a_pagos: true,
      no_mens: 1,
      total_meses: 3,
      tag: 'NA',
      se_divide: false,
      gasto_x_mes: 'NA'
    },
    {
      concepto: 'Depósito',
      monto: 281.0,
      tipo_gasto: 'Variable' as const,
      forma_pago: 'BBVA Oro',
      mes: 'Agosto',
      anio: 2025,
      fecha_cargo: new Date('2025-09-01'),
      fecha_pago: new Date('2025-09-01'),
      categoria: 'E' as const,
      a_pagos: false,
      no_mens: 0,
      total_meses: 0,
      tag: 'NA',
      se_divide: false,
      gasto_x_mes: 'AGO'
    },
    {
      concepto: 'Puntos',
      monto: -10.0,
      tipo_gasto: 'Variable' as const,
      forma_pago: 'BBVA Oro',
      mes: 'Agosto',
      anio: 2025,
      fecha_cargo: new Date('2025-09-01'),
      fecha_pago: new Date('2025-09-01'),
      categoria: 'I' as const,
      a_pagos: false,
      no_mens: 0,
      total_meses: 0,
      tag: 'NA',
      se_divide: false,
      gasto_x_mes: 'NA'
    }
  ];

  for (const gasto of gastosEjemplo) {
    await prisma.gasto.create({
      data: gasto
    });
  }

  console.log('✅ Gastos de ejemplo creados');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
