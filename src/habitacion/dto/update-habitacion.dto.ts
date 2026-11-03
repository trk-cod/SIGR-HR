import { PartialType } from '@nestjs/swagger';
import { CreateHabitacionDto } from './create-habitacion.dto.js';

export class UpdateHabitacionDto extends PartialType(CreateHabitacionDto) {}