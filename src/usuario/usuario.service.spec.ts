
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';

import { UsuarioService } from './usuario.service.js';

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe('UsuarioService', () => {
  let service: UsuarioService;

  const usuarioMock = {
    id_usuario: 1,
    nombre_usuario: 'recepcion01',
    id_rol: 2,
    ultimo_acceso: null,
    estado: true,
    rol: {
      id_rol: 2,
      nombre_rol: 'Recepcionista',
    },
  };

  const prismaMock = {
    rol: {
      findUnique: vi.fn(),
    },
    usuario: {
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  const configMock = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    configMock.get.mockReturnValue(10);

    service = new UsuarioService(
      prismaMock as any,
      configMock as any,
    );
  });

  describe('crearUsuario', () => {
    const dto = {
      nombre_usuario: 'recepcion01',
      contrasena_usuario: 'ClaveSegura123',
      id_rol: 2,
    };

    it('debe crear un usuario con contraseña hasheada', async () => {
      const hash = '$2b$10$hashsimulado';

      prismaMock.rol.findUnique.mockResolvedValue({
        id_rol: 2,
        estado: true,
      });

      vi.mocked(bcrypt.hash).mockResolvedValue(hash as never);
      prismaMock.usuario.create.mockResolvedValue(usuarioMock);

      const resultado = await service.crearUsuario(dto);

      expect(resultado).toEqual(usuarioMock);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        dto.contrasena_usuario,
        10,
      );

      expect(prismaMock.usuario.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          contrasena_usuario: hash,
        },
        select: expect.not.objectContaining({
          contrasena_usuario: true,
        }),
      });
    });

    it('no debe crear un usuario si el rol no existe', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(null);

      await expect(
        service.crearUsuario(dto),
      ).rejects.toThrow(BadRequestException);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prismaMock.usuario.create).not.toHaveBeenCalled();
    });

    it('no debe crear un usuario si el rol está inactivo', async () => {
      prismaMock.rol.findUnique.mockResolvedValue({
        id_rol: 2,
        estado: false,
      });

      await expect(
        service.crearUsuario(dto),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.usuario.create).not.toHaveBeenCalled();
    });
  });

  describe('listarUsuarios', () => {
    it('debe listar usuarios con paginación', async () => {
      prismaMock.$transaction.mockResolvedValue([
        1,
        [usuarioMock],
      ]);

      const resultado = await service.listarUsuarios({
        page: 1,
        limit: 10,
      } as any);

      expect(resultado).toBeDefined();

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.usuario.count).toHaveBeenCalledWith({
        where: {},
      });

      expect(prismaMock.usuario.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.not.objectContaining({
          contrasena_usuario: true,
        }),
        skip: 0,
        take: 10,
        orderBy: { nombre_usuario: 'asc' },
      });
    });

    it('debe filtrar usuarios por nombre sin distinguir mayúsculas', async () => {
      prismaMock.$transaction.mockResolvedValue([
        1,
        [usuarioMock],
      ]);

      await service.listarUsuarios({
        page: 1,
        limit: 10,
        search: 'recep',
      } as any);

      expect(prismaMock.usuario.count).toHaveBeenCalledWith({
        where: {
          nombre_usuario: {
            contains: 'recep',
            mode: 'insensitive',
          },
        },
      });
    });
  });

  describe('buscarUnUsuario', () => {
    it('debe encontrar un usuario por su ID', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);

      const resultado = await service.buscarUnUsuario(1);

      expect(resultado).toEqual(usuarioMock);

      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
        select: expect.not.objectContaining({
          contrasena_usuario: true,
        }),
      });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.buscarUnUsuario(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('actualizarUsuario', () => {
    it('debe actualizar los datos del usuario', async () => {
      const dto = {
        nombre_usuario: 'recepcion02',
      };

      prismaMock.usuario.update.mockResolvedValue({
        ...usuarioMock,
        ...dto,
      });

      const resultado = await service.actualizarUsuario(1, dto);

      expect(resultado.nombre_usuario).toBe('recepcion02');

      expect(prismaMock.usuario.update).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
        data: dto,
        select: expect.not.objectContaining({
          contrasena_usuario: true,
        }),
      });
    });

    it('debe validar el rol cuando se cambia', async () => {
      const dto = { id_rol: 3 };

      prismaMock.rol.findUnique.mockResolvedValue({
        id_rol: 3,
        estado: true,
      });

      prismaMock.usuario.update.mockResolvedValue({
        ...usuarioMock,
        id_rol: 3,
      });

      await service.actualizarUsuario(1, dto);

      expect(prismaMock.rol.findUnique).toHaveBeenCalledWith({
        where: { id_rol: 3 },
      });
    });

    it('no debe actualizar si el nuevo rol no existe', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(null);

      await expect(
        service.actualizarUsuario(1, { id_rol: 999 }),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.usuario.update).not.toHaveBeenCalled();
    });

    it('no debe actualizar si el nuevo rol está inactivo', async () => {
      prismaMock.rol.findUnique.mockResolvedValue({
        id_rol: 3,
        estado: false,
      });

      await expect(
        service.actualizarUsuario(1, { id_rol: 3 }),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.usuario.update).not.toHaveBeenCalled();
    });
  });

  describe('cambiarContrasena', () => {
    it('debe cambiar la contraseña si la actual es correcta', async () => {
      const hashNuevo = '$2b$10$nuevohash';

      prismaMock.usuario.findUnique.mockResolvedValue({
        contrasena_usuario: '$2b$10$hashanterior',
      });

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashNuevo as never);
      prismaMock.usuario.update.mockResolvedValue({});

      const resultado = await service.cambiarContrasena(1, {
        contrasena_actual: 'ClaveAnterior123',
        contrasena_nueva: 'ClaveNueva123',
      });

      expect(resultado).toEqual({
        message: 'Contraseña actualizada',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'ClaveAnterior123',
        '$2b$10$hashanterior',
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'ClaveNueva123',
        10,
      );

      expect(prismaMock.usuario.update).toHaveBeenCalledWith({
        where: { id_usuario: 1 },
        data: { contrasena_usuario: hashNuevo },
      });
    });

    it('no debe cambiar la contraseña si la actual es incorrecta', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue({
        contrasena_usuario: '$2b$10$hashanterior',
      });

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        service.cambiarContrasena(1, {
          contrasena_actual: 'Incorrecta123',
          contrasena_nueva: 'ClaveNueva123',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prismaMock.usuario.update).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.cambiarContrasena(999, {
          contrasena_actual: 'ClaveAnterior123',
          contrasena_nueva: 'ClaveNueva123',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('desactivarUsuario', () => {
    it('debe desactivar otro usuario', async () => {
      prismaMock.usuario.update.mockResolvedValue({
        ...usuarioMock,
        estado: false,
      });

      const resultado = await service.desactivarUsuario(2, 1);

      expect(resultado.estado).toBe(false);

      expect(prismaMock.usuario.update).toHaveBeenCalledWith({
        where: { id_usuario: 2 },
        data: { estado: false },
        select: expect.not.objectContaining({
          contrasena_usuario: true,
        }),
      });
    });

    it('no debe permitir desactivar el propio usuario', async () => {
      await expect(
        service.desactivarUsuario(1, 1),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.usuario.update).not.toHaveBeenCalled();
    });
  });
});
