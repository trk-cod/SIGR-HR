<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
=======

import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

>>>>>>> equipo/develop
import { RolService } from './rol.service.js';

describe('RolService', () => {
  let service: RolService;

<<<<<<< HEAD
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolService],
    }).compile();

    service = module.get<RolService>(RolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
=======
  const rolMock = {
    id_rol: 1,
    nombre_rol: 'Recepcionista',
    descripcion: 'Rol de recepción',
    estado: true,
  };

  const prismaMock = {
    rol: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    usuario: {
      count: vi.fn(),
    },
    permiso: {
      count: vi.fn(),
    },
    rolPermiso: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new RolService(prismaMock as any);
  });

  describe('crearRol', () => {
    it('debe crear un rol correctamente', async () => {
      const dto = {
        nombre_rol: 'Auditor',
        descripcion: 'Solo consulta',
      };

      prismaMock.rol.create.mockResolvedValue(rolMock);

      const resultado = await service.crearRol(dto);

      expect(resultado).toEqual(rolMock);
      expect(prismaMock.rol.create).toHaveBeenCalledWith({
        data: dto,
      });
    });

    it('debe manejar errores al crear un rol', async () => {
      prismaMock.rol.create.mockRejectedValue(
        new Error('Error de base de datos'),
      );

      await expect(
        service.crearRol({ nombre_rol: 'Auditor' }),
      ).rejects.toThrow();
    });
  });

  describe('listarRoles', () => {
    it('debe listar los roles con sus conteos', async () => {
      const roles = [rolMock];

      prismaMock.rol.findMany.mockResolvedValue(roles);

      const resultado = await service.listarRoles();

      expect(resultado).toEqual(roles);
      expect(prismaMock.rol.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              usuarios: true,
              permisos: true,
            },
          },
        },
        orderBy: {
          nombre_rol: 'asc',
        },
      });
    });

    it('debe manejar errores al listar roles', async () => {
      prismaMock.rol.findMany.mockRejectedValue(
        new Error('Error de base de datos'),
      );

      await expect(service.listarRoles()).rejects.toThrow();
    });
  });

  describe('buscarUnRol', () => {
    it('debe encontrar un rol por su ID', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(rolMock);

      const resultado = await service.buscarUnRol(1);

      expect(resultado).toEqual(rolMock);
      expect(prismaMock.rol.findUnique).toHaveBeenCalledWith({
        where: { id_rol: 1 },
        include: {
          permisos: {
            include: {
              permiso: true,
            },
          },
        },
      });
    });

    it('debe lanzar NotFoundException si el rol no existe', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(null);

      await expect(
        service.buscarUnRol(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('actualizarRol', () => {
    it('debe actualizar un rol existente', async () => {
      const dto = {
        nombre_rol: 'Administrador',
      };

      prismaMock.rol.findUnique.mockResolvedValue(rolMock);
      prismaMock.rol.update.mockResolvedValue({
        ...rolMock,
        ...dto,
      });

      const resultado = await service.actualizarRol(1, dto);

      expect(resultado.nombre_rol).toBe('Administrador');
      expect(prismaMock.rol.update).toHaveBeenCalledWith({
        where: { id_rol: 1 },
        data: dto,
      });
    });

    it('no debe actualizar un rol inexistente', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(null);

      await expect(
        service.actualizarRol(999, {
          nombre_rol: 'Administrador',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.rol.update).not.toHaveBeenCalled();
    });
  });

  describe('desactivarRol', () => {
    it('debe desactivar un rol sin usuarios activos', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(rolMock);
      prismaMock.usuario.count.mockResolvedValue(0);
      prismaMock.rol.update.mockResolvedValue({
        ...rolMock,
        estado: false,
      });

      const resultado = await service.desactivarRol(1);

      expect(resultado.estado).toBe(false);
      expect(prismaMock.usuario.count).toHaveBeenCalledWith({
        where: {
          id_rol: 1,
          estado: true,
        },
      });
      expect(prismaMock.rol.update).toHaveBeenCalledWith({
        where: { id_rol: 1 },
        data: { estado: false },
      });
    });

    it('debe impedir desactivar un rol con usuarios activos', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(rolMock);
      prismaMock.usuario.count.mockResolvedValue(2);

      await expect(
        service.desactivarRol(1),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.rol.update).not.toHaveBeenCalled();
    });

    it('no debe desactivar un rol inexistente', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(null);

      await expect(
        service.desactivarRol(999),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.usuario.count).not.toHaveBeenCalled();
    });
  });

  describe('asignarPermisos', () => {
    it('debe reemplazar los permisos de un rol correctamente', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(rolMock);
      prismaMock.permiso.count.mockResolvedValue(2);
      prismaMock.rolPermiso.deleteMany.mockReturnValue({
        count: 1,
      });
      prismaMock.rolPermiso.createMany.mockReturnValue({
        count: 2,
      });
      prismaMock.$transaction.mockResolvedValue([
        { count: 1 },
        { count: 2 },
      ]);

      const resultado = await service.asignarPermisos(1, {
        permisoIds: [1, 2],
      });

      expect(resultado).toEqual(rolMock);

      expect(prismaMock.permiso.count).toHaveBeenCalledWith({
        where: {
          id_permiso: {
            in: [1, 2],
          },
        },
      });

      expect(prismaMock.rolPermiso.deleteMany).toHaveBeenCalledWith({
        where: { id_rol: 1 },
      });

      expect(prismaMock.rolPermiso.createMany).toHaveBeenCalledWith({
        data: [
          { id_rol: 1, id_permiso: 1 },
          { id_rol: 1, id_permiso: 2 },
        ],
      });

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });

    it('debe eliminar los IDs duplicados antes de asignar permisos', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(rolMock);
      prismaMock.permiso.count.mockResolvedValue(2);
      prismaMock.rolPermiso.deleteMany.mockReturnValue({});
      prismaMock.rolPermiso.createMany.mockReturnValue({});
      prismaMock.$transaction.mockResolvedValue([{}, {}]);

      await service.asignarPermisos(1, {
        permisoIds: [1, 1, 2, 2],
      });

      expect(prismaMock.permiso.count).toHaveBeenCalledWith({
        where: {
          id_permiso: {
            in: [1, 2],
          },
        },
      });

      expect(prismaMock.rolPermiso.createMany).toHaveBeenCalledWith({
        data: [
          { id_rol: 1, id_permiso: 1 },
          { id_rol: 1, id_permiso: 2 },
        ],
      });
    });

    it('debe rechazar permisos que no existen', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(rolMock);
      prismaMock.permiso.count.mockResolvedValue(1);

      await expect(
        service.asignarPermisos(1, {
          permisoIds: [1, 2],
        }),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('no debe asignar permisos a un rol inexistente', async () => {
      prismaMock.rol.findUnique.mockResolvedValue(null);

      await expect(
        service.asignarPermisos(999, {
          permisoIds: [1, 2],
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.permiso.count).not.toHaveBeenCalled();
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });
>>>>>>> equipo/develop
  });
});
