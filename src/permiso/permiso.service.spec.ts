<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { PermisoService } from './permiso.service.js';
=======
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermisoService } from './permiso.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../common/prisma-error.js';

vi.mock('../common/prisma-error.js', () => ({
  handlePrismaError: vi.fn(),
}));
>>>>>>> equipo/develop

describe('PermisoService', () => {
  let service: PermisoService;

<<<<<<< HEAD
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermisoService],
    }).compile();

    service = module.get<PermisoService>(PermisoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
=======
  const prismaMock = {
    permiso: {
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new PermisoService(
      prismaMock as unknown as PrismaService,
    );
  });

  describe('listarPermisos', () => {
    it('debe listar los permisos ordenados alfabéticamente', async () => {
      const permisos = [
        { id_permiso: 1, nombre_permiso: 'Crear' },
        { id_permiso: 2, nombre_permiso: 'Editar' },
        { id_permiso: 3, nombre_permiso: 'Ver' },
      ];

      prismaMock.permiso.findMany.mockResolvedValue(permisos);

      const resultado = await service.listarPermisos();

      expect(prismaMock.permiso.findMany).toHaveBeenCalledWith({
        orderBy: {
          nombre_permiso: 'asc',
        },
      });

      expect(resultado).toEqual(permisos);
    });

    it('debe devolver una lista vacía cuando no existen permisos', async () => {
      prismaMock.permiso.findMany.mockResolvedValue([]);

      const resultado = await service.listarPermisos();

      expect(resultado).toEqual([]);
    });

    it('debe manejar los errores al consultar los permisos', async () => {
      const error = new Error('Error de base de datos');

      prismaMock.permiso.findMany.mockRejectedValue(error);

      await service.listarPermisos();

      expect(handlePrismaError).toHaveBeenCalledWith(
        error,
        expect.anything(),
        'listarPermisos',
      );
    });
  });
});
>>>>>>> equipo/develop
