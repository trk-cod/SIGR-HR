import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HuespedService } from './huesped.service.js';
import { PrismaService } from '../message/prisma/prisma.service.js';

describe('HuespedService', () => {
  let service: HuespedService;

  const huesped = {
    id_huesped: 1,
    nombre_hu: 'María Elena',
    apellido_hu: 'Pérez',
    identificacion_hu: '001-1234567-8',
    estado: true,
  };

  // PrismaService falso: no usa la base de datos real
  const prismaMock = {
    huesped: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuespedService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<HuespedService>(HuespedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('listarHuespedes devuelve la lista de huéspedes', async () => {
    prismaMock.huesped.findMany.mockResolvedValue([huesped]);
    await expect(service.listarHuespedes()).resolves.toEqual([huesped]);
  });

  it('buscarUnHuesped lanza NotFoundException si no existe', async () => {
    prismaMock.huesped.findUnique.mockResolvedValue(null);
    await expect(service.buscarUnHuesped(99)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('desactivarHuesped cambia el estado a false', async () => {
    prismaMock.huesped.findUnique.mockResolvedValue(huesped);
    prismaMock.huesped.update.mockResolvedValue({ ...huesped, estado: false });

    const resultado = await service.desactivarHuesped(1);

    expect(prismaMock.huesped.update).toHaveBeenCalledWith({
      where: { id_huesped: 1 },
      data: { estado: false },
    });
    expect(resultado.estado).toBe(false);
  });
});