import { PartialType } from '@nestjs/swagger';
import { CreateCargoDto } from './create-cargo.dto.js';

export class UpdateCargoDto extends PartialType(CreateCargoDto) {}