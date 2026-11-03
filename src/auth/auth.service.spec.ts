
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';

import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BitacoraService } from '../bitacora/bitacora.service.js';

describe('AuthService', () => {
  let service: AuthService;

  const contrasena = 'Admin12345*';
  let usuarioMock: any;

  const prismaMock = {
    usuario: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  const jwtMock = {
    signAsync: vi.fn(),
  };

  const bitacoraMock = {
    registrar: vi.fn(),
  };

  const configMock = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    usuarioMock = {
      id_usuario: 1,
      nombre_usuario: 'admin',
      contrasena_usuario: await bcrypt.hash(contrasena, 10),
      estado: true,
      rol: {
        nombre_rol: 'Administrador',
        estado: true,
        permisos: [
          {
            permiso: {
              nombre_permiso: 'usuario:ver',
            },
          },
        ],
      },
    };

    prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
    prismaMock.usuario.update.mockResolvedValue(usuarioMock);
    jwtMock.signAsync.mockResolvedValue('token-de-prueba');
    bitacoraMock.registrar.mockResolvedValue(undefined);
    configMock.get.mockReturnValue(3600);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: BitacoraService, useValue: bitacoraMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('inicia sesión correctamente y devuelve un JWT', async () => {
    const resultado = await service.login(
      {
        nombre_usuario: 'admin',
        contrasena_usuario: contrasena,
      },
      '127.0.0.1',
    );

    expect(resultado.access_token).toBe('token-de-prueba');
    expect(resultado.token_type).toBe('Bearer');
    expect(resultado.expires_in).toBe(3600);
    expect(resultado.usuario.nombre_usuario).toBe('admin');

    expect(jwtMock.signAsync).toHaveBeenCalledWith({
      sub: 1,
      usuario: 'admin',
      rol: 'Administrador',
      permisos: ['usuario:ver'],
    });
  });

  it('rechaza un usuario inexistente', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        nombre_usuario: 'inexistente',
        contrasena_usuario: contrasena,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rechaza una contraseña incorrecta', async () => {
    await expect(
      service.login({
        nombre_usuario: 'admin',
        contrasena_usuario: 'Incorrecta123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rechaza un usuario inactivo', async () => {
    usuarioMock.estado = false;

    await expect(
      service.login({
        nombre_usuario: 'admin',
        contrasena_usuario: contrasena,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rechaza un rol inactivo', async () => {
    usuarioMock.rol.estado = false;

    await expect(
      service.login({
        nombre_usuario: 'admin',
        contrasena_usuario: contrasena,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('actualiza la fecha del último acceso', async () => {
    await service.login({
      nombre_usuario: 'admin',
      contrasena_usuario: contrasena,
    });

    expect(prismaMock.usuario.update).toHaveBeenCalledWith({
      where: { id_usuario: 1 },
      data: { ultimo_acceso: expect.any(Date) },
    });
  });

  it('registra el inicio de sesión en la bitácora', async () => {
    await service.login(
      {
        nombre_usuario: 'admin',
        contrasena_usuario: contrasena,
      },
      '127.0.0.1',
    );

    expect(bitacoraMock.registrar).toHaveBeenCalledWith({
      id_usuario: 1,
      accion: 'LOGIN',
      tabla_afectada: 'usuario',
      registro_id: '1',
      ip_equipo: '127.0.0.1',
    });
  });

  it('no devuelve la contraseña ni su hash', async () => {
    const resultado = await service.login({
      nombre_usuario: 'admin',
      contrasena_usuario: contrasena,
    });

    expect(resultado.usuario).not.toHaveProperty('contrasena_usuario');
    expect(resultado.usuario).not.toHaveProperty('password');
    expect(resultado.usuario).not.toHaveProperty('hash');
  });
});
