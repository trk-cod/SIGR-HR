import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto.js';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['contrasena_usuario'] as const),
) {}