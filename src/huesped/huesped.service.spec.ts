
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { HuespedService } from './huesped.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('HuespedService', () => {
  let service: HuespedService;

  const uuid = '0b6f1c1e-3b0a-4c11-9a77-2f6f6f0d1a11';

  const huesped = {
    id_huesped: uuid,
  };

  const prismaMock = {
    $transaction: vi.fn(),
    huesped: {
      create: vi.fn(),
      count: vi.fn(),
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
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<HuespedService>(HuespedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('listarHuespedes devuelve la página con su meta', async () => {
    prismaMock.$transaction.mockResolvedValue([1, [huesped]]);

    const resultado = await service.listarHuespedes({
      page: 1,
      limit: 10,
    });

    expect(resultado.data).toEqual([huesped]);
    expect(resultado.meta.total).toBe(1);
    expect(resultado.meta.page).toBe(1);
    expect(resultado.meta.limit).toBe(10);
    expect(resultado.meta.totalPages).toBe(1);
    expect(resultado.meta.hasNext).toBe(false);
    expect(resultado.meta.hasPrev).toBe(false);
  });

  it('buscarUnHuesped utiliza un UUID', async () => {
    prismaMock.huesped.findUnique.mockResolvedValue(huesped);

    const resultado = await service.buscarUnHuesped(uuid);

    expect(resultado).toEqual(huesped);
    expect(prismaMock.huesped.findUnique).toHaveBeenCalledWith({
      where: { id_huesped: uuid },
    });
  });
});

