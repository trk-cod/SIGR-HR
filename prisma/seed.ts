import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import {
  TODOS_LOS_PERMISOS,
  type Permiso,
} from '../src/common/permisos.js';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error('No se encontró DATABASE_URL en el archivo .env');
}

const saltRounds = Number.parseInt(
  process.env['BCRYPT_SALT_ROUNDS'] ?? '10',
  10,
);

if (!Number.isInteger(saltRounds) || saltRounds < 4) {
  throw new Error('BCRYPT_SALT_ROUNDS debe ser un entero válido mayor o igual a 4');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const prefijos = (...modulos: string[]) => (permiso: Permiso) =>
  modulos.some((modulo) => permiso.startsWith(`${modulo}:`));

// ------------------------------------------------------------
// ROLES Y PERMISOS
// ------------------------------------------------------------

const ROLES: Record<
  string,
  { descripcion: string; incluye: (permiso: Permiso) => boolean }
> = {
  Administrador: {
    descripcion: 'Acceso total al sistema',
    incluye: () => true,
  },
  Gerente: {
    descripcion: 'Supervisión y gestión del hotel',
    incluye: (permiso) =>
      permiso.endsWith(':ver') ||
      prefijos('reserva', 'pago', 'factura', 'empleado')(permiso),
  },
  Recepcionista: {
    descripcion: 'Atención al cliente, reservas y pagos',
    incluye: (permiso) =>
      prefijos('huesped', 'reserva', 'check-in', 'check-out')(permiso) ||
      [
        'habitacion:ver',
        'tarifa:ver',
        'tipo-habitacion:ver',
        'estado-habitacion:ver',
        'estado-reserva:ver',
        'metodo-pago:ver',
        'pago:crear',
        'pago:ver',
        'factura:crear',
        'factura:ver',
      ].includes(permiso),
  },
  Mantenimiento: {
    descripcion: 'Mantenimiento de habitaciones',
    incluye: (permiso) =>
      prefijos('mantenimiento')(permiso) ||
      [
        'habitacion:ver',
        'historial-habitacion:ver',
        'historial-habitacion:crear',
      ].includes(permiso),
  },
};

async function seedSeguridad() {
  console.log('Cargando roles, permisos y usuarios...');

  await prisma.permiso.createMany({
    data: TODOS_LOS_PERMISOS.map((nombre_permiso) => ({
      nombre_permiso,
      descripcion: `Permiso ${nombre_permiso}`,
    })),
    skipDuplicates: true,
  });

  const permisos = await prisma.permiso.findMany();

  for (const [nombre_rol, configuracion] of Object.entries(ROLES)) {
    const rol = await prisma.rol.upsert({
      where: { nombre_rol },
      update: {},
      create: {
        nombre_rol,
        descripcion: configuracion.descripcion,
      },
    });

    const permisosDelRol = permisos
      .filter((permiso) =>
        configuracion.incluye(permiso.nombre_permiso as Permiso),
      )
      .map((permiso) => ({
        id_rol: rol.id_rol,
        id_permiso: permiso.id_permiso,
      }));

    await prisma.rolPermiso.createMany({
      data: permisosDelRol,
      skipDuplicates: true,
    });
  }

  const contrasenaInicial =
    process.env['SEED_ADMIN_PASSWORD'] ?? 'Admin12345*';

  const contrasenaHash = await bcrypt.hash(
    contrasenaInicial,
    saltRounds,
  );

  const usuarios = [
    { nombre_usuario: 'admin', nombre_rol: 'Administrador' },
    { nombre_usuario: 'gerente', nombre_rol: 'Gerente' },
    { nombre_usuario: 'recepcion', nombre_rol: 'Recepcionista' },
    { nombre_usuario: 'mantenimiento', nombre_rol: 'Mantenimiento' },
  ];

  for (const usuario of usuarios) {
    const rol = await prisma.rol.findUniqueOrThrow({
      where: { nombre_rol: usuario.nombre_rol },
    });

    await prisma.usuario.upsert({
      where: { nombre_usuario: usuario.nombre_usuario },
      update: {},
      create: {
        nombre_usuario: usuario.nombre_usuario,
        contrasena_usuario: contrasenaHash,
        id_rol: rol.id_rol,
      },
    });
  }
}

// ------------------------------------------------------------
// PERSONAL
// ------------------------------------------------------------

async function seedPersonal() {
  console.log('Cargando cargos y empleados...');

  const cantidadCargos = await prisma.cargo.count();

  if (cantidadCargos === 0) {
    await prisma.cargo.createMany({
      data: [
        {
          nombre_car: 'Gerente General',
          descripcion: 'Responsable de la administración del hotel',
          sueldo_base: 60000,
        },
        {
          nombre_car: 'Recepcionista',
          descripcion: 'Atención y servicio al huésped',
          sueldo_base: 25000,
        },
        {
          nombre_car: 'Personal de Mantenimiento',
          descripcion: 'Mantenimiento de las instalaciones',
          sueldo_base: 22000,
        },
      ],
    });
  }

  const cantidadEmpleados = await prisma.empleado.count();

  if (cantidadEmpleados === 0) {
    const cargos = await prisma.cargo.findMany();

    const cargoGerente = cargos.find(
      (cargo) => cargo.nombre_car === 'Gerente General',
    );
    const cargoRecepcionista = cargos.find(
      (cargo) => cargo.nombre_car === 'Recepcionista',
    );
    const cargoMantenimiento = cargos.find(
      (cargo) => cargo.nombre_car === 'Personal de Mantenimiento',
    );

    if (!cargoGerente || !cargoRecepcionista || !cargoMantenimiento) {
      throw new Error('No se encontraron todos los cargos necesarios');
    }

    await prisma.empleado.createMany({
      data: [
        {
          nombre_em: 'Ana',
          apellido_em: 'Rodríguez',
          cedula_em: '00100000001',
          fecha_nac_emp: new Date('1988-03-15'),
          sexo: true,
          correo_em: 'ana@hotelrea.com',
          id_cargo: cargoGerente.id_cargo,
          fecha_ingreso: new Date('2025-01-01'),
          salario_actual: 60000,
        },
        {
          nombre_em: 'Luis',
          apellido_em: 'Pérez',
          cedula_em: '00100000002',
          fecha_nac_emp: new Date('1995-07-21'),
          sexo: false,
          correo_em: 'luis@hotelrea.com',
          id_cargo: cargoRecepcionista.id_cargo,
          fecha_ingreso: new Date('2025-01-01'),
          salario_actual: 25000,
        },
        {
          nombre_em: 'Carlos',
          apellido_em: 'Mejía',
          cedula_em: '00100000003',
          fecha_nac_emp: new Date('1992-11-02'),
          sexo: false,
          correo_em: 'carlos@hotelrea.com',
          id_cargo: cargoMantenimiento.id_cargo,
          fecha_ingreso: new Date('2025-01-01'),
          salario_actual: 22000,
        },
      ],
    });
  }
}

// ------------------------------------------------------------
// HABITACIONES Y TARIFAS
// ------------------------------------------------------------

async function seedHabitaciones() {
  console.log('Cargando habitaciones y tarifas...');

  if ((await prisma.estadoHabitacion.count()) === 0) {
    await prisma.estadoHabitacion.createMany({
      data: [
        { nombre_estado: 'Disponible', descripcion: 'Habitación disponible' },
        { nombre_estado: 'Ocupada', descripcion: 'Habitación ocupada' },
        { nombre_estado: 'Limpieza', descripcion: 'En proceso de limpieza' },
        {
          nombre_estado: 'Mantenimiento',
          descripcion: 'Fuera de servicio por mantenimiento',
        },
      ],
    });
  }

  if ((await prisma.tipoHabitacion.count()) === 0) {
    await prisma.tipoHabitacion.createMany({
      data: [
        {
          nombre_tipo: 'Sencilla',
          descripcion: 'Habitación para una persona',
          capacidad: 1,
          cantidad_camas: 1,
        },
        {
          nombre_tipo: 'Doble',
          descripcion: 'Habitación para dos personas',
          capacidad: 2,
          cantidad_camas: 2,
        },
        {
          nombre_tipo: 'Suite',
          descripcion: 'Habitación amplia para cuatro personas',
          capacidad: 4,
          cantidad_camas: 2,
        },
      ],
    });
  }

  if ((await prisma.habitacion.count()) === 0) {
    const tipos = await prisma.tipoHabitacion.findMany();
    const disponible = await prisma.estadoHabitacion.findFirst({
      where: { nombre_estado: 'Disponible' },
    });

    if (!disponible) {
      throw new Error('No se encontró el estado Disponible');
    }

    const sencilla = tipos.find((tipo) => tipo.nombre_tipo === 'Sencilla');
    const doble = tipos.find((tipo) => tipo.nombre_tipo === 'Doble');
    const suite = tipos.find((tipo) => tipo.nombre_tipo === 'Suite');

    if (!sencilla || !doble || !suite) {
      throw new Error('No se encontraron todos los tipos de habitación');
    }

    await prisma.habitacion.createMany({
      data: [
        {
          numero_habitacion: '101',
          piso: 1,
          id_tipo: sencilla.id_thabitacion,
          id_est_habitacion: disponible.id_est_habitacion,
        },
        {
          numero_habitacion: '102',
          piso: 1,
          id_tipo: doble.id_thabitacion,
          id_est_habitacion: disponible.id_est_habitacion,
        },
        {
          numero_habitacion: '103',
          piso: 1,
          id_tipo: doble.id_thabitacion,
          id_est_habitacion: disponible.id_est_habitacion,
        },
        {
          numero_habitacion: '201',
          piso: 2,
          id_tipo: suite.id_thabitacion,
          id_est_habitacion: disponible.id_est_habitacion,
        },
        {
          numero_habitacion: '202',
          piso: 2,
          id_tipo: suite.id_thabitacion,
          id_est_habitacion: disponible.id_est_habitacion,
        },
      ],
    });
  }

  if ((await prisma.tarifa.count()) === 0) {
    const tipos = await prisma.tipoHabitacion.findMany();

    const precios: Record<string, number> = {
      Sencilla: 2500,
      Doble: 3500,
      Suite: 6500,
    };

    await prisma.tarifa.createMany({
      data: tipos
        .filter((tipo) => precios[tipo.nombre_tipo] !== undefined)
        .map((tipo) => ({
          id_thabitacion: tipo.id_thabitacion,
          nombre_temporada: 'Regular',
          descripcion: 'Tarifa de temporada regular',
          fecha_inicio: new Date('2026-01-01'),
          fecha_fin: new Date('2026-12-31'),
          precio_noche: precios[tipo.nombre_tipo],
        })),
    });
  }
}

// ------------------------------------------------------------
// RESERVAS Y MÉTODOS DE PAGO
// ------------------------------------------------------------

async function seedReservasYPagos() {
  console.log('Cargando estados de reserva y métodos de pago...');

  if ((await prisma.estadoReserva.count()) === 0) {
    await prisma.estadoReserva.createMany({
      data: [
        { nombre_est_res: 'Pendiente' },
        { nombre_est_res: 'Confirmada' },
        { nombre_est_res: 'Cancelada' },
        { nombre_est_res: 'Finalizada' },
      ],
    });
  }

  if ((await prisma.metodoPago.count()) === 0) {
    await prisma.metodoPago.createMany({
      data: [
        { nombre_metodo: 'Efectivo' },
        { nombre_metodo: 'Tarjeta Débito' },
        { nombre_metodo: 'Tarjeta Crédito' },
        { nombre_metodo: 'Transferencia' },
      ],
    });
  }
}

// ------------------------------------------------------------
// HUÉSPEDES DE PRUEBA
// ------------------------------------------------------------

async function seedHuespedes() {
  console.log('Cargando huéspedes de prueba...');

  const nombres = ['María', 'Juan', 'Carmen', 'Pedro', 'Luisa'];
  const apellidos = [
    'Santana',
    'Reyes',
    'Fernández',
    'Cabrera',
    'Medina',
  ];

  const huespedes = Array.from({ length: 25 }, (_, i) => ({
    nombre_hu: nombres[i % nombres.length],
    apellido_hu: apellidos[i % apellidos.length],
    identificacion_hu: `001-${String(1000000 + i)}-${i % 10}`,
    correo_hu: `huesped${i + 1}@correo.com`,
    nacionalidad_hu: 'Dominicana',
  }));

  await prisma.huesped.createMany({
    data: huespedes,
    skipDuplicates: true,
  });
}

// ------------------------------------------------------------
// EJECUCIÓN PRINCIPAL
// ------------------------------------------------------------

async function main() {
  await seedSeguridad();
  await seedPersonal();
  await seedHabitaciones();
  await seedReservasYPagos();
  await seedHuespedes();

  console.log('Seed ejecutado correctamente.');
}

main()
  .catch((error: unknown) => {
    console.error('Error al ejecutar el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });