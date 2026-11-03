import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from '@nestjs/common';
import { BitacoraService } from './bitacora.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { paginar } from '../common/paginacion.js';

vi.mock('../common/prisma-error.js', () => ({
  handlePrismaError: vi.fn(),
}));

vi.mock('../common/paginacion.js', () => ({
  paginar: vi.fn(),
}));

describe('BitacoraService', () => {
  let service: BitacoraService;

  const prismaMock = {
    bitacora: {
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new BitacoraService(
      prismaMock as unknown as PrismaService,
    );
  });

  describe('registrar', () => {
    it('debe registrar correctamente un evento', async () => {
      const datos = {
        id_usuario: 1,
        accion: 'INSERT',
        tabla_afectada: 'Huesped',
        registro_id: '10',
        descripcion: 'Registro de un nuevo huésped',
        ip_equipo: '192.168.1.10',
      };

      prismaMock.bitacora.create.mockResolvedValue({});

      await service.registrar(datos);

      expect(prismaMock.bitacora.create).toHaveBeenCalledWith({
        data: {
          id_usuario: 1,
          accion: 'INSERT',
          tabla_afectada: 'Huesped',
          registro_id: '10',
          descripcion: 'Registro de un nuevo huésped',
          ip_equipo: '192.168.1.10',
        },
      });
    });

    it('debe asignar null al registro_id cuando no se proporciona', async () => {
      prismaMock.bitacora.create.mockResolvedValue({});

      await service.registrar({
        id_usuario: 1,
        accion: 'UPDATE',
        tabla_afectada: 'Usuario',
      });

      expect(prismaMock.bitacora.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          registro_id: null,
        }),
      });
    });

    it('debe limitar la descripción a 300 caracteres', async () => {
      const descripcion = 'A'.repeat(350);

      prismaMock.bitacora.create.mockResolvedValue({});

      await service.registrar({
        id_usuario: 1,
        accion: 'INSERT',
        tabla_afectada: 'Huesped',
        descripcion,
      });

      expect(prismaMock.bitacora.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          descripcion: 'A'.repeat(300),
        }),
      });
    });

    it('debe limitar la dirección IP a 45 caracteres', async () => {
      const ip = '1'.repeat(50);

      prismaMock.bitacora.create.mockResolvedValue({});

      await service.registrar({
        id_usuario: 1,
        accion: 'INSERT',
        tabla_afectada: 'Huesped',
        ip_equipo: ip,
      });

      expect(prismaMock.bitacora.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ip_equipo: '1'.repeat(45),
        }),
      });
    });

    it('no debe interrumpir la operación cuando falla el registro', async () => {
      const error = new Error('Error de base de datos');
      const loggerSpy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

      prismaMock.bitacora.create.mockRejectedValue(error);

      await expect(
        service.registrar({
          id_usuario: 1,
          accion: 'INSERT',
          tabla_afectada: 'Huesped',
        }),
      ).resolves.toBeUndefined();

      expect(loggerSpy).toHaveBeenCalled();

      loggerSpy.mockRestore();
    });
  });

  describe('listarBitacora', () => {
    it('debe listar los registros con paginación', async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      const registros = [
        { id_bitacora: 1, accion: 'INSERT' },
        { id_bitacora: 2, accion: 'UPDATE' },
      ];

      const resultadoPaginado = {
        data: registros,
        total: 2,
      };

      prismaMock.$transaction.mockResolvedValue([2, registros]);
      vi.mocked(paginar).mockReturnValue(resultadoPaginado as never);

      const resultado = await service.listarBitacora(query);

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(paginar).toHaveBeenCalledWith(
        registros,
        2,
        1,
        10,
      );
      expect(resultado).toEqual(resultadoPaginado);
    });

    it('debe filtrar por usuario cuando se proporciona id_usuario', async () => {
  const query = {
    page: 1,
    limit: 10,
    id_usuario: 5,
  };

  prismaMock.bitacora.count.mockResolvedValue(0);
  prismaMock.bitacora.findMany.mockResolvedValue([]);
  prismaMock.$transaction.mockResolvedValue([0, []]);

  vi.mocked(paginar).mockReturnValue({} as never);

  await service.listarBitacora(query);

  expect(prismaMock.bitacora.count).toHaveBeenCalledWith({
    where: {
      id_usuario: 5,
    },
  });

  expect(prismaMock.bitacora.findMany).toHaveBeenCalledWith({
    where: {
      id_usuario: 5,
    },
    skip: 0,
    take: 10,
    orderBy: {
      fecha_hora: 'desc',
    },
  });
});

    it('debe filtrar por tabla_afectada cuando se proporciona', async () => {
      const query = {
        page: 1,
        limit: 10,
        tabla_afectada: 'Huesped',
      };

      prismaMock.$transaction.mockResolvedValue([0, []]);
      vi.mocked(paginar).mockReturnValue({} as never);

      await service.listarBitacora(query);

      expect(prismaMock.bitacora.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tabla_afectada: 'Huesped',
          },
        }),
      );
    });

    it('debe aplicar los filtros de usuario y tabla simultáneamente', async () => {
      const query = {
        page: 2,
        limit: 5,
        id_usuario: 3,
        tabla_afectada: 'Usuario',
      };

      prismaMock.$transaction.mockResolvedValue([0, []]);
      vi.mocked(paginar).mockReturnValue({} as never);

      await service.listarBitacora(query);

      const where = {
        id_usuario: 3,
        tabla_afectada: 'Usuario',
      };

      expect(prismaMock.bitacora.count).toHaveBeenCalledWith({
        where,
      });

      expect(prismaMock.bitacora.findMany).toHaveBeenCalledWith({
        where,
        skip: 5,
        take: 5,
        orderBy: {
          fecha_hora: 'desc',
        },
      });
    });

    it('debe manejar los errores al consultar la bitácora', async () => {
      const error = new Error('Error de base de datos');

      prismaMock.$transaction.mockRejectedValue(error);

      await service.listarBitacora({
        page: 1,
        limit: 10,
      });

      expect(handlePrismaError).toHaveBeenCalledWith(
        error,
        expect.anything(),
        'listarBitacora',
      );
    });
  });
});