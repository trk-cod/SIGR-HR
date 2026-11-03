<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
=======

import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

>>>>>>> equipo/develop
import { HuespedController } from './huesped.controller.js';
import { HuespedService } from './huesped.service.js';

describe('HuespedController', () => {
  let controller: HuespedController;

<<<<<<< HEAD
  // HuespedService falso: el controlador solo debe delegar en el servicio
  const serviceMock = {
    listarHuespedes: vi.fn().mockResolvedValue([]),
=======
  const huespedServiceMock = {
    listarHuespedes: vi.fn(),
>>>>>>> equipo/develop
    buscarUnHuesped: vi.fn(),
    crearHuesped: vi.fn(),
    actualizarHuesped: vi.fn(),
    desactivarHuesped: vi.fn(),
  };

  beforeEach(async () => {
<<<<<<< HEAD
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HuespedController],
      providers: [{ provide: HuespedService, useValue: serviceMock }],
=======
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HuespedController],
      providers: [
        {
          provide: HuespedService,
          useValue: huespedServiceMock,
        },
      ],
>>>>>>> equipo/develop
    }).compile();

    controller = module.get<HuespedController>(HuespedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

<<<<<<< HEAD
  it('listarHuespedes llama al servicio', async () => {
    await expect(controller.listarHuespedes()).resolves.toEqual([]);
    expect(serviceMock.listarHuespedes).toHaveBeenCalled();
  });
});
=======
  it('listarHuespedes llama al servicio con los parámetros', async () => {
    const query = { page: 1, limit: 10 };
    const respuesta = { data: [], meta: {} };

    huespedServiceMock.listarHuespedes.mockResolvedValue(respuesta);

    const resultado = await controller.listarHuespedes(query);

    expect(resultado).toEqual(respuesta);
    expect(huespedServiceMock.listarHuespedes).toHaveBeenCalledWith(query);
  });
});

>>>>>>> equipo/develop
