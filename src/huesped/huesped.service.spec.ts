<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HuespedService } from './huesped.service.js';
import { PrismaService } from '../message/prisma/prisma.service.js';
=======

import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { HuespedService } from './huesped.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
>>>>>>> equipo/develop

describe('HuespedService', () => {
  let service: HuespedService;

<<<<<<< HEAD
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
=======
  const uuid = '0b6f1c1e-3b0a-4c11-9a77-2f6f6f0d1a11';

  const huesped = {
    id_huesped: uuid,
  };

  const prismaMock = {
    $transaction: vi.fn(),
    huesped: {
      create: vi.fn(),
      count: vi.fn(),
>>>>>>> equipo/develop
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
<<<<<<< HEAD
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuespedService,
        { provide: PrismaService, useValue: prismaMock },
=======

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HuespedService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
>>>>>>> equipo/develop
      ],
    }).compile();

    service = module.get<HuespedService>(HuespedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

<<<<<<< HEAD
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
=======
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

>>>>>>> equipo/develop
