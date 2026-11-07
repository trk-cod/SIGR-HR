export const RESERVA_HUESPED_INACTIVO =
  'El huésped no existe o se encuentra inactivo.';

export const RESERVA_EMPLEADO_INACTIVO =
  'El empleado no existe o se encuentra inactivo.';

export const RESERVA_HABITACION_NO_DISPONIBLE =
  'Una o más habitaciones no están disponibles para esas fechas.';

export const RESERVA_CAPACIDAD_INSUFICIENTE =
  'La capacidad total de las habitaciones es insuficiente.';

export const RESERVA_FECHAS_INVALIDAS =
  'La fecha de salida debe ser posterior a la fecha de entrada.';

export const RESERVA_NO_ENCONTRADA =
  'No se encontró la reserva solicitada.';

export const RESERVA_ESTADO_INVALIDO =
  'La reserva no se encuentra en un estado que permita esta operación.';

export const RESERVA_FECHAS_SUPERPUESTAS =
  'Ya existe una reserva para una o más habitaciones en ese período.';

export const RESERVA_RANGO_FECHAS_INVALIDO =
  'La fecha inicial no puede ser posterior a la fecha final.';

export const RESERVA_SIN_CAMPOS_ACTUALIZAR =
  'Debes proporcionar al menos un campo para actualizar.';

export const RESERVA_ESTADO_NO_REGISTRADO = (estado: string) =>
  `No está registrado el estado ${estado}.`;
