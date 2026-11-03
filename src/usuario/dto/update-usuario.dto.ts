<<<<<<< HEAD
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto.js';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  estado?: boolean;
}
=======
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto.js';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['contrasena_usuario'] as const),
) {}
>>>>>>> equipo/develop
