import { PartialType } from '@nestjs/swagger';
import { CreateRolDto } from './create-rol.dto.js';

export class UpdateRolDto extends PartialType(CreateRolDto) {}