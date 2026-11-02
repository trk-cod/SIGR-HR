
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { HuespedController } from './huesped.controller.js';
import { HuespedService } from './huesped.service.js';

describe('HuespedController', () => {
  let controller: HuespedController;

  const huespedServiceMock = {
    listarHuespedes: vi.fn(),
    buscarUnHuesped: vi.fn(),
    crearHuesped: vi.fn(),
    actualizarHuesped: vi.fn(),
    desactivarHuesped: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HuespedController],
      providers: [
        {
          provide: HuespedService,
          useValue: huespedServiceMock,
        },
      ],
    }).compile();

    controller = module.get<HuespedController>(HuespedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('listarHuespedes llama al servicio con los parámetros', async () => {
    const query = { page: 1, limit: 10 };
    const respuesta = { data: [], meta: {} };

    huespedServiceMock.listarHuespedes.mockResolvedValue(respuesta);

    const resultado = await controller.listarHuespedes(query);

    expect(resultado).toEqual(respuesta);
    expect(huespedServiceMock.listarHuespedes).toHaveBeenCalledWith(query);
  });
});

