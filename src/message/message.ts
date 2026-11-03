// Errores generales
export const NOT_FOUND_EXCEPTION = 'Elemento no encontrado';

export const CONFLICT_EXCEPTION =
  'Ya existe un registro con esos datos únicos';

export const BAD_REQUEST_FK_EXCEPTION =
  'Uno de los registros relacionados no existe';

export const FK_IN_USE_EXCEPTION =
  'No se puede eliminar: el registro está siendo usado';

export const INTERNAL_ERROR_EXCEPTION =
  'Ocurrió un error interno. Intenta nuevamente';

// Seguridad
export const INVALID_CREDENTIALS_EXCEPTION =
  'Usuario o contraseña incorrectos';

export const UNAUTHORIZED_EXCEPTION =
  'Debes iniciar sesión para continuar';

export const FORBIDDEN_EXCEPTION =
  'No tienes permiso para realizar esta acción';

// Éxito
export const DELETED_MESSAGE = 'Registro desactivado correctamente';

// Mensajes con datos dinámicos
export const NOT_FOUND_BY_ID_EXCEPTION = (
  entidad: string,
  id: number | string,
) => `No se encontró ${entidad} con el id: ${id}`;

// Mensajes de cada módulo
export * from './huesped.message.js';
export * from './seguridad.message.js';