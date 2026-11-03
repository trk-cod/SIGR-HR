export const PAGO_INVALIDO_EXCEPTION = 'El pago no existe, no pertenece a esa reserva o no está Completado';
export const PAGO_EN_USO_EXCEPTION = 'No se puede anular: el pago ya tiene una factura Emitida';
export const PAGO_NO_COMPLETADO_EXCEPTION = 'Solo se puede anular un pago Completado';
export const METODO_PAGO_INVALIDO_EXCEPTION = 'El método de pago no existe o está inactivo';
export const RESERVA_INVALIDA_PAGO_EXCEPTION = 'La reserva no existe o está Cancelada';
export const TARIFA_NO_ENCONTRADA_EXCEPTION = 'No hay tarifa vigente para ese tipo de habitación en esa fecha';
export const FACTURA_DUPLICADA_EXCEPTION = 'Ya existe una factura para ese pago';
export const FACTURA_NO_ANULABLE_EXCEPTION = 'Solo se puede anular una factura Emitida';