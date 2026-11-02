export const MODULOS = [
  'usuario',
  'rol',
  'permiso',
  'bitacora',
  'cargo',
  'empleado',
  'huesped',
  'estado-habitacion',
  'tipo-habitacion',
  'habitacion',
  'tarifa',
  'historial-habitacion',
  'mantenimiento',
  'estado-reserva',
  'reserva',
  'check-in',
  'check-out',
  'metodo-pago',
  'pago',
  'factura',
] as const;

export const ACCIONES = ['crear', 'ver', 'editar', 'desactivar'] as const;

export type Permiso = `${(typeof MODULOS)[number]}:${(typeof ACCIONES)[number]}`;

export const TODOS_LOS_PERMISOS: Permiso[] = MODULOS.flatMap((modulo) =>
  ACCIONES.map((accion): Permiso => `${modulo}:${accion}`),
);