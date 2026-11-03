import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Request } from 'express';

import { BitacoraService } from './bitacora.service.js';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface.js';

const ACCIONES: Record<string, string> = {
  POST: 'INSERT',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

@Injectable()
export class BitacoraInterceptor implements NestInterceptor {
  constructor(private readonly bitacoraService: BitacoraService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const req = context.switchToHttp().getRequest<
      Request & { usuario?: JwtPayload }
    >();

    const accion = ACCIONES[req.method];

    if (!accion || !req.usuario) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((respuesta) => {
        const id =
          (req.params['id'] as string | undefined) ?? primerId(respuesta);

        void this.bitacoraService.registrar({
          id_usuario: req.usuario!.sub,
          accion,
          tabla_afectada: req.path.split('/')[1] ?? 'desconocida',
          registro_id: id ?? null,
          descripcion: `${req.method} ${req.path}`,
          ip_equipo: req.ip,
        });
      }),
    );
  }
}

function primerId(respuesta: unknown): string | undefined {
  if (typeof respuesta !== 'object' || respuesta === null) {
    return undefined;
  }

  const par = Object.entries(respuesta).find(([clave]) =>
    clave.startsWith('id_'),
  );

  return par ? String(par[1]) : undefined;
}