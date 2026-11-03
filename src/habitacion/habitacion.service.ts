import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';
import type { Prisma } from '../generated/prisma/client.js';
import { CreateHabitacionDto } from './dto/create-habitacion.dto.js';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto.js';
import { ListarHabitacionesDto } from './dto/listar-habitaciones.dto.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { paginar } from '../common/paginacion.js';
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  HABITACION_DUPLICADA_EXCEPTION,
  TIPO_HABITACION_INVALIDO_EXCEPTION,
  ESTADO_HABITACION_INVALIDO_EXCEPTION,
  HABITACION_EN_USO_EXCEPTION,
} from '../message/message.js';

const INCLUIR = {
  tipo: { select: { nombre_tipo: true, capacidad: true } },
  estado_actual: { select: { nombre_estado: true } },
} satisfies Prisma.HabitacionInclude;

@Injectable()
export class HabitacionService {
  private readonly logger = new Logger(HabitacionService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private async validarRelaciones(id_tipo?: number, id_est_habitacion?: number) {
    if (id_tipo !== undefined) {
      const tipo = await this.prismaService.tipoHabitacion.findUnique({
        where: { id_thabitacion: id_tipo },
      });
      if (!tipo || !tipo.estado) {
        throw new BadRequestException(TIPO_HABITACION_INVALIDO_EXCEPTION);
      }
    }
    if (id_est_habitacion !== undefined) {
      const estado = await this.prismaService.estadoHabitacion.findUnique({
        where: { id_est_habitacion },
      });
      if (!estado) throw new BadRequestException(ESTADO_HABITACION_INVALIDO_EXCEPTION);
    }
  }

  async crearHabitacion(dto: CreateHabitacionDto) {
    try {
      await this.validarRelaciones(dto.id_tipo, dto.id_est_habitacion);
      return await this.prismaService.habitacion.create({ data: dto, include: INCLUIR });
    } catch (error) {
      handlePrismaError(error, this.logger, 'crearHabitacion', HABITACION_DUPLICADA_EXCEPTION);
    }
  }

    async listarHabitaciones(query: ListarHabitacionesDto) {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const { id_tipo, id_est_habitacion } = query;
      
      const where: Prisma.HabitacionWhereInput = {
        ...(id_tipo ? { id_tipo } : {}),
        ...(id_est_habitacion ? { id_est_habitacion } : {}),
      };
      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.habitacion.count({ where }),
        this.prismaService.habitacion.findMany({
          where,
          include: INCLUIR,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { numero_habitacion: 'asc' },
        }),
      ]);
      return paginar(data, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarHabitaciones');
    }
  }

  async buscarUnaHabitacion(id_habitacion: number) {
    try {
      const habitacion = await this.prismaService.habitacion.findUnique({
        where: { id_habitacion },
        include: INCLUIR,
      });
      if (!habitacion) {
        throw new NotFoundException(NOT_FOUND_BY_ID_EXCEPTION('habitación', id_habitacion));
      }
      return habitacion;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnaHabitacion');
    }
  }

  async actualizarHabitacion(id_habitacion: number, dto: UpdateHabitacionDto) {
    try {
      await this.buscarUnaHabitacion(id_habitacion);
      await this.validarRelaciones(dto.id_tipo, dto.id_est_habitacion);
      return await this.prismaService.habitacion.update({
        where: { id_habitacion },
        data: dto,
        include: INCLUIR,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'actualizarHabitacion', HABITACION_DUPLICADA_EXCEPTION);
    }
  }

  // Sin campo estado: se elimina solo si nunca se usó
  async eliminarHabitacion(id_habitacion: number) {
    try {
      await this.buscarUnaHabitacion(id_habitacion);
      return await this.prismaService.habitacion.delete({ where: { id_habitacion } });
    } catch (error) {
      handlePrismaError(
        error,
        this.logger,
        'eliminarHabitacion',
        undefined,
        HABITACION_EN_USO_EXCEPTION,
      );
    }
  }
}