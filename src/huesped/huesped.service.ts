<<<<<<< HEAD
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';
import type { Huesped, Prisma } from '../generated/prisma/client.js';
import { CreateHuespedDto } from './dto/create-huesped.dto.js';
import { UpdateHuespedDto } from './dto/update-huesped.dto.js';
import { ListarHuespedesDto } from './dto/listar-huespedes.dto.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { Paginado, paginar } from '../common/paginacion.js';
=======

import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { Huesped, Prisma } from '../generated/prisma/client.js';

import { CreateHuespedDto } from './dto/create-huesped.dto.js';
import { UpdateHuespedDto } from './dto/update-huesped.dto.js';
import { ListarHuespedesDto } from './dto/listar-huespedes.dto.js';

import { handlePrismaError } from '../common/prisma-error.js';
import { paginar, type Paginado } from '../common/paginacion.js';

>>>>>>> equipo/develop
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  HUESPED_DUPLICADO_EXCEPTION,
} from '../message/message.js';

@Injectable()
export class HuespedService {
  private readonly logger = new Logger(HuespedService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async crearHuesped(dto: CreateHuespedDto): Promise<Huesped> {
    try {
      return await this.prismaService.huesped.create({ data: dto });
    } catch (error) {
<<<<<<< HEAD
      handlePrismaError(error, this.logger, 'crearHuesped', HUESPED_DUPLICADO_EXCEPTION);
    }
  }

  async listarHuespedes(query: ListarHuespedesDto): Promise<Paginado<Huesped>> {
    try {
   const { page = 1, limit = 10, search } = query;      const where: Prisma.HuespedWhereInput = search
=======
      handlePrismaError(
        error,
        this.logger,
        'crearHuesped',
        HUESPED_DUPLICADO_EXCEPTION,
      );
    }
  }

  async listarHuespedes(
    query: ListarHuespedesDto,
  ): Promise<Paginado<Huesped>> {
    try {
      const { page, limit, search } = query;

      const where: Prisma.HuespedWhereInput = search
>>>>>>> equipo/develop
        ? {
            OR: [
              { nombre_hu: { contains: search, mode: 'insensitive' } },
              { apellido_hu: { contains: search, mode: 'insensitive' } },
              { identificacion_hu: { contains: search } },
            ],
          }
        : {};

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.huesped.count({ where }),
        this.prismaService.huesped.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { apellido_hu: 'asc' },
        }),
      ]);
<<<<<<< HEAD
=======

>>>>>>> equipo/develop
      return paginar(data, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarHuespedes');
    }
  }

  async buscarUnHuesped(id_huesped: string): Promise<Huesped> {
    try {
      const huesped = await this.prismaService.huesped.findUnique({
        where: { id_huesped },
      });
<<<<<<< HEAD
      if (!huesped) {
        throw new NotFoundException(NOT_FOUND_BY_ID_EXCEPTION('huésped', id_huesped));
      }
=======

      if (!huesped) {
        throw new NotFoundException(
          NOT_FOUND_BY_ID_EXCEPTION('huésped', id_huesped),
        );
      }

>>>>>>> equipo/develop
      return huesped;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnHuesped');
    }
  }

<<<<<<< HEAD
  async actualizarHuesped(id_huesped: string, dto: UpdateHuespedDto): Promise<Huesped> {
    try {
      await this.buscarUnHuesped(id_huesped);
=======
  async actualizarHuesped(
    id_huesped: string,
    dto: UpdateHuespedDto,
  ): Promise<Huesped> {
    try {
      await this.buscarUnHuesped(id_huesped);

>>>>>>> equipo/develop
      return await this.prismaService.huesped.update({
        where: { id_huesped },
        data: dto,
      });
    } catch (error) {
<<<<<<< HEAD
      handlePrismaError(error, this.logger, 'actualizarHuesped', HUESPED_DUPLICADO_EXCEPTION);
    }
  }

  // Baja lógica: el huésped puede tener reservas, por eso no se borra
  async desactivarHuesped(id_huesped: string): Promise<Huesped> {
    try {
      await this.buscarUnHuesped(id_huesped);
=======
      handlePrismaError(
        error,
        this.logger,
        'actualizarHuesped',
        HUESPED_DUPLICADO_EXCEPTION,
      );
    }
  }

  // Baja lógica: el huésped puede tener reservas, por eso no se borra.
  async desactivarHuesped(id_huesped: string): Promise<Huesped> {
    try {
      await this.buscarUnHuesped(id_huesped);

>>>>>>> equipo/develop
      return await this.prismaService.huesped.update({
        where: { id_huesped },
        data: { estado: false },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'desactivarHuesped');
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> equipo/develop
