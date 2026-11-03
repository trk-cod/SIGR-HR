
import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { JwtAuthGuard } from './jwt-auth.guard.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const jwtMock = {
    verifyAsync: vi.fn(),
  };

  const reflectorMock = {
    getAllAndOverride: vi.fn(),
  };

  const requestMock = {
    headers: {
      authorization: undefined as string | undefined,
    },
    usuario: undefined as unknown,
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

    requestMock.headers.authorization = undefined;
    requestMock.usuario = undefined;

    guard = new JwtAuthGuard(
      jwtMock as unknown as JwtService,
      reflectorMock as unknown as Reflector,
    );
  });

  it('permite el acceso a una ruta pública', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(true);

    await expect(guard.canActivate(contextMock as any)).resolves.toBe(true);

    expect(jwtMock.verifyAsync).not.toHaveBeenCalled();
  });

  it('rechaza una solicitud sin token', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    await expect(
      guard.canActivate(contextMock as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rechaza un token que no utiliza Bearer', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    requestMock.headers.authorization = 'Basic token-invalido';

    await expect(
      guard.canActivate(contextMock as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rechaza un token inválido o expirado', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    requestMock.headers.authorization = 'Bearer token-invalido';
    jwtMock.verifyAsync.mockRejectedValue(new Error('Token inválido'));

    await expect(
      guard.canActivate(contextMock as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('permite el acceso con un token válido', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    requestMock.headers.authorization = 'Bearer token-valido';

    const payload = {
      sub: 1,
      usuario: 'admin',
      rol: 'Administrador',
      permisos: ['usuario:ver'],
    };

    jwtMock.verifyAsync.mockResolvedValue(payload);

    await expect(guard.canActivate(contextMock as any)).resolves.toBe(true);

    expect(requestMock.usuario).toEqual(payload);
    expect(jwtMock.verifyAsync).toHaveBeenCalledWith('token-valido');
  });
});
