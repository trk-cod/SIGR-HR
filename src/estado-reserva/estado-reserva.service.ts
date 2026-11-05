import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../common/prisma-error.js';
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  FK_IN_USE_EXCEPTION,
} from '../message/message.js';

import { CreateEstadoReservaDto } from './dto/create-estado-reserva.dto.js';
import { UpdateEstadoReservaDto } from './dto/update-estado-reserva.dto.js';

@Injectable()
export class EstadoReservaService {
  private readonly logger = new Logger(EstadoReservaService.name);

  constructor(private readonly prismaService: PrismaService) {}

  // Crear un estado de reserva
  async crearEstadoReserva(dto: CreateEstadoReservaDto) {
    try {
      return await this.prismaService.estadoReserva.create({
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'crearEstadoReserva');
    }
  }

  // Listar todos los estados de reserva
  async listarEstadosReserva() {
    try {
      return await this.prismaService.estadoReserva.findMany({
        orderBy: {
          id_est_reserva: 'asc',
        },
        include: {
          _count: {
            select: {
              reservas: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarEstadosReserva');
    }
  }

  // Buscar un estado de reserva por su ID
  async buscarUnEstadoReserva(id_est_reserva: number) {
    try {
      const estado = await this.prismaService.estadoReserva.findUnique({
        where: { id_est_reserva },
        include: {
          _count: {
            select: {
              reservas: true,
            },
          },
        },
      });

      if (!estado) {
        throw new NotFoundException(
          NOT_FOUND_BY_ID_EXCEPTION('estado de reserva', id_est_reserva),
        );
      }

      return estado;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnEstadoReserva');
    }
  }

  // Actualizar un estado de reserva
  async actualizarEstadoReserva(
    id_est_reserva: number,
    dto: UpdateEstadoReservaDto,
  ) {
    try {
      await this.buscarUnEstadoReserva(id_est_reserva);

      return await this.prismaService.estadoReserva.update({
        where: { id_est_reserva },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'actualizarEstadoReserva');
    }
  }

  // Eliminar un estado de reserva
  async eliminarEstadoReserva(id_est_reserva: number) {
    try {
      const estado = await this.buscarUnEstadoReserva(id_est_reserva);

      if (estado._count.reservas > 0) {
        throw new BadRequestException(FK_IN_USE_EXCEPTION);
      }

      return await this.prismaService.estadoReserva.delete({
        where: { id_est_reserva },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'eliminarEstadoReserva');
    }
  }
}
