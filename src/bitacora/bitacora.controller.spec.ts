<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { BitacoraController } from './bitacora.controller.js';
=======
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BitacoraController } from './bitacora.controller.js';
import { BitacoraService } from './bitacora.service.js';
>>>>>>> equipo/develop

describe('BitacoraController', () => {
  let controller: BitacoraController;

<<<<<<< HEAD
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BitacoraController],
    }).compile();

    controller = module.get<BitacoraController>(BitacoraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
=======
  const bitacoraServiceMock = {
    listarBitacora: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new BitacoraController(
      bitacoraServiceMock as unknown as BitacoraService,
    );
  });

  describe('listarBitacora', () => {
    it('debe listar los registros de bitácora', async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      const registros = {
        data: [
          { id_bitacora: 1, accion: 'INSERT' },
          { id_bitacora: 2, accion: 'UPDATE' },
        ],
        total: 2,
      };

      bitacoraServiceMock.listarBitacora.mockResolvedValue(registros);

      const resultado = await controller.listarBitacora(query);

      expect(bitacoraServiceMock.listarBitacora).toHaveBeenCalledWith(query);
      expect(resultado).toEqual(registros);
    });

    it('debe enviar los filtros recibidos al servicio', async () => {
      const query = {
        page: 2,
        limit: 5,
        id_usuario: 3,
        tabla_afectada: 'Usuario',
      };

      bitacoraServiceMock.listarBitacora.mockResolvedValue({});

      await controller.listarBitacora(query);

      expect(bitacoraServiceMock.listarBitacora).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        id_usuario: 3,
        tabla_afectada: 'Usuario',
      });
    });

    it('debe propagar los errores del servicio', async () => {
      const error = new Error('Error al consultar la bitácora');

      bitacoraServiceMock.listarBitacora.mockRejectedValue(error);

      await expect(
        controller.listarBitacora({
          page: 1,
          limit: 10,
        }),
      ).rejects.toThrow(error);
    });
  });
});
>>>>>>> equipo/develop
