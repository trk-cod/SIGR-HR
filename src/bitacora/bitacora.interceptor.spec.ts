
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firstValueFrom, of } from 'rxjs';
import {
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { BitacoraInterceptor } from './bitacora.interceptor.js';
import { BitacoraService } from './bitacora.service.js';

describe('BitacoraInterceptor', () => {
  let interceptor: BitacoraInterceptor;

  const bitacoraServiceMock = {
    registrar: vi.fn(),
  };

  const usuario = {
    sub: 5,
    usuario: 'admin',
    rol: 'Administrador',
    permisos: ['huesped:crear'],
  };

  const crearContexto = (
    method: string,
    opciones: {
      usuario?: typeof usuario | null;
      params?: Record<string, string>;
      path?: string;
      ip?: string;
    } = {},
  ) => {
    const request = {
      method,
      usuario:
        opciones.usuario === undefined
          ? usuario
          : opciones.usuario,
      params: opciones.params ?? {},
      path: opciones.path ?? '/huesped',
      ip: opciones.ip ?? '192.168.1.10',
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    return context as unknown as ExecutionContext;
  };

  const crearHandler = (respuesta: unknown): CallHandler => ({
    handle: () => of(respuesta),
  });

  beforeEach(() => {
    vi.clearAllMocks();

    bitacoraServiceMock.registrar.mockResolvedValue(undefined);

    interceptor = new BitacoraInterceptor(
      bitacoraServiceMock as unknown as BitacoraService,
    );
  });

  describe('intercept', () => {
    it('debe registrar una operación POST como INSERT', async () => {
      const context = crearContexto('POST');

      await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler({ id_huesped: 10 }),
        ),
      );

      expect(bitacoraServiceMock.registrar).toHaveBeenCalledWith({
        id_usuario: 5,
        accion: 'INSERT',
        tabla_afectada: 'huesped',
        registro_id: '10',
        descripcion: 'POST /huesped',
        ip_equipo: '192.168.1.10',
      });
    });

    it('debe registrar PUT como UPDATE', async () => {
      const context = crearContexto('PUT', {
        params: { id: '15' },
      });

      await firstValueFrom(
        interceptor.intercept(context, crearHandler({})),
      );

      expect(bitacoraServiceMock.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          accion: 'UPDATE',
          registro_id: '15',
        }),
      );
    });

    it('debe registrar PATCH como UPDATE', async () => {
      const context = crearContexto('PATCH');

      await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler({ id_usuario: 8 }),
        ),
      );

      expect(bitacoraServiceMock.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          accion: 'UPDATE',
          registro_id: '8',
        }),
      );
    });

    it('debe registrar DELETE como DELETE', async () => {
      const context = crearContexto('DELETE', {
        params: { id: '20' },
      });

      await firstValueFrom(
        interceptor.intercept(context, crearHandler({})),
      );

      expect(bitacoraServiceMock.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          accion: 'DELETE',
          registro_id: '20',
        }),
      );
    });

    it('no debe registrar operaciones GET', async () => {
      const context = crearContexto('GET');

      await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler({ id_huesped: 10 }),
        ),
      );

      expect(bitacoraServiceMock.registrar).not.toHaveBeenCalled();
    });

    it('no debe registrar operaciones sin usuario autenticado', async () => {
      const context = crearContexto('POST', {
        usuario: null,
      });

      await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler({ id_huesped: 10 }),
        ),
      );

      expect(bitacoraServiceMock.registrar).not.toHaveBeenCalled();
    });

    it('debe obtener el ID del primer campo que comienza con id_', async () => {
      const context = crearContexto('POST');

      await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler({
            id_rol: 3,
            nombre: 'Administrador',
          }),
        ),
      );

      expect(bitacoraServiceMock.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          registro_id: '3',
        }),
      );
    });

    it('debe asignar null cuando no encuentra un ID', async () => {
      const context = crearContexto('POST');

      await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler({
            mensaje: 'Operación realizada',
          }),
        ),
      );

      expect(bitacoraServiceMock.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          registro_id: null,
        }),
      );
    });

    it('debe priorizar el ID de los parámetros de la ruta', async () => {
      const context = crearContexto('PUT', {
        params: { id: '25' },
      });

      await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler({ id_huesped: 99 }),
        ),
      );

      expect(bitacoraServiceMock.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          registro_id: '25',
        }),
      );
    });

    it('debe devolver la respuesta original de la operación', async () => {
      const respuesta = {
        id_huesped: 10,
        nombre: 'Juan',
      };

      const context = crearContexto('POST');

      const resultado = await firstValueFrom(
        interceptor.intercept(
          context,
          crearHandler(respuesta),
        ),
      );

      expect(resultado).toEqual(respuesta);
    });
  });
});
