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

import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto.js';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto.js';

@Injectable()
export class MetodoPagoService {
  private readonly logger = new Logger(MetodoPagoService.name);

  constructor(private readonly prismaService: PrismaService) {}

  // Crear un método de pago
  async crearMetodoPago(dto: CreateMetodoPagoDto) {
    try {
      return await this.prismaService.metodoPago.create({
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'crearMetodoPago');
    }
  }

  // Listar todos los métodos de pago
  async listarMetodosPago() {
    try {
      return await this.prismaService.metodoPago.findMany({
        orderBy: {
          id_met_pago: 'asc',
        },
        include: {
          _count: {
            select: {
              pagos: true,
            },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarMetodosPago');
    }
  }

  // Buscar un método de pago por ID
  async buscarUnMetodoPago(id_met_pago: number) {
    try {
      const metodo = await this.prismaService.metodoPago.findUnique({
        where: { id_met_pago },
        include: {
          _count: {
            select: {
              pagos: true,
            },
          },
        },
      });

      if (!metodo) {
        throw new NotFoundException(
          NOT_FOUND_BY_ID_EXCEPTION('método de pago', id_met_pago),
        );
      }

      return metodo;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnMetodoPago');
    }
  }

  // Actualizar un método de pago
  async actualizarMetodoPago(
    id_met_pago: number,
    dto: UpdateMetodoPagoDto,
  ) {
    try {
      await this.buscarUnMetodoPago(id_met_pago);

      return await this.prismaService.metodoPago.update({
        where: { id_met_pago },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'actualizarMetodoPago');
    }
  }

  // Eliminar un método de pago
  async eliminarMetodoPago(id_met_pago: number) {
    try {
      const metodo = await this.buscarUnMetodoPago(id_met_pago);

      if (metodo._count.pagos > 0) {
        throw new BadRequestException(FK_IN_USE_EXCEPTION);
      }

      return await this.prismaService.metodoPago.delete({
        where: { id_met_pago },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'eliminarMetodoPago');
    }
  }
}