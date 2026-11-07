import { PartialType } from '@nestjs/swagger';
import { CreateEstadoReservaDto } from './create-estado-reserva.dto.js';

export class UpdateEstadoReservaDto extends PartialType(CreateEstadoReservaDto) {}
