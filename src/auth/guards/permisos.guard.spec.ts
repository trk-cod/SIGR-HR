
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { PermisosGuard } from './permisos.guard.js';

describe('PermisosGuard', () => {
  let guard: PermisosGuard;

  const reflectorMock = {
    getAllAndOverride: vi.fn(),
  };

  const requestMock = {
    usuario: undefined as
      | {
          sub: number;
          usuario: string;
          rol: string;
          permisos: string[];
        }
      | undefined,
  };

  const contextMock = {
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({
      getRequest: () => requestMock,
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    requestMock.usuario = undefined;

    guard = new PermisosGuard(
      reflectorMock as unknown as Reflector,
    );
  });

  it('permite el acceso cuando la ruta no requiere permisos específicos', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(contextMock as any)).toBe(true);
  });

  it('permite el acceso cuando el usuario tiene el permiso requerido', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['usuario:ver']);

    requestMock.usuario = {
      sub: 1,
      usuario: 'admin',
      rol: 'Administrador',
      permisos: ['usuario:ver'],
    };

    expect(guard.canActivate(contextMock as any)).toBe(true);
  });

  it('permite el acceso cuando el usuario tiene todos los permisos requeridos', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([
      'usuario:ver',
      'usuario:crear',
    ]);

    requestMock.usuario = {
      sub: 1,
      usuario: 'admin',
      rol: 'Administrador',
      permisos: ['usuario:ver', 'usuario:crear', 'rol:ver'],
    };

    expect(guard.canActivate(contextMock as any)).toBe(true);
  });

  it('rechaza el acceso cuando falta uno de los permisos requeridos', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([
      'usuario:ver',
      'usuario:crear',
    ]);

    requestMock.usuario = {
      sub: 2,
      usuario: 'recepcion',
      rol: 'Recepcionista',
      permisos: ['usuario:ver'],
    };

    expect(() =>
      guard.canActivate(contextMock as any),
    ).toThrow(ForbiddenException);
  });

  it('rechaza el acceso cuando no existe un usuario autenticado', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['usuario:ver']);

    expect(() =>
      guard.canActivate(contextMock as any),
    ).toThrow(ForbiddenException);
  });

  it('rechaza el acceso cuando el usuario no tiene permisos', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['usuario:ver']);

    requestMock.usuario = {
      sub: 3,
      usuario: 'mantenimiento',
      rol: 'Mantenimiento',
      permisos: [],
    };

    expect(() =>
      guard.canActivate(contextMock as any),
    ).toThrow(ForbiddenException);
  });
});
