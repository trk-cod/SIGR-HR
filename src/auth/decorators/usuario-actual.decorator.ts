import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';
<<<<<<< HEAD
=======

>>>>>>> equipo/develop
export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<{ usuario: JwtPayload }>().usuario,
);