import { PartialType } from '@nestjs/swagger';
import { CreateMetodoPagoDto } from './create-metodo-pago.dto.js';

export class UpdateMetodoPagoDto extends PartialType(CreateMetodoPagoDto) {}