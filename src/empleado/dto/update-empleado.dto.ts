import { PartialType } from '@nestjs/swagger';
import { CreateEmpleadoDto } from './create-empleado.dto.js';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {}