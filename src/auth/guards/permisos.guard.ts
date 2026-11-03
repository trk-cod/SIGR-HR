import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISOS_KEY } from '../decorators/permisos.decorator.js';
import type { Permiso } from '../../common/permisos.js';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';
import { FORBIDDEN_EXCEPTION } from '../../message/message.js';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requeridos = this.reflector.getAllAndOverride<Permiso[]>(
      PERMISOS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requeridos?.length) return true;

    const { usuario } = context.switchToHttp().getRequest<{
      usuario?: JwtPayload;
    }>();

    const autorizado = requeridos.every((p) =>
      usuario?.permisos.includes(p),
    );

    if (!autorizado) {
      throw new ForbiddenException(FORBIDDEN_EXCEPTION);
    }

    return true;
  }
}