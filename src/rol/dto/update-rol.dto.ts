<<<<<<< HEAD
import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto.js';

export class UpdateRolDto extends PartialType(CreateRolDto) {
  activo?: boolean;
}
=======
import { PartialType } from '@nestjs/swagger';
import { CreateRolDto } from './create-rol.dto.js';

export class UpdateRolDto extends PartialType(CreateRolDto) {}
>>>>>>> equipo/develop
