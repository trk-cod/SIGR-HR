import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../message/prisma/prisma.service.js';import { CreatePagoDto } from './dto/create-pago.dto.js';
import { ListarPagosDto } from './dto/listar-pagos.dto.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { paginar } from '../common/paginacion.js';
import { ESTADO_PAGO, ESTADO_FACTURA } from '../common/estados.js';
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  METODO_PAGO_INVALIDO_EXCEPTION,
  RESERVA_INVALIDA_PAGO_EXCEPTION,
  PAGO_EN_USO_EXCEPTION,
  PAGO_NO_COMPLETADO_EXCEPTION,
} from '../message/message.js';

const INCLUIR = {
  metodo_pago: { select: { id_met_pago: true, nombre_metodo: true } },
  reserva: { select: { id_reserva: true, fecha_entrada: true, fecha_salida: true } },
} satisfies Prisma.PagoInclude;

@Injectable()
export class PagoService {
  private readonly logger = new Logger(PagoService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async crearPago(dto: CreatePagoDto) {
    try {
      const metodo = await this.prismaService.metodoPago.findUnique({
        where: { id_met_pago: dto.id_met_pago },
      });
      if (!metodo) throw new BadRequestException(METODO_PAGO_INVALIDO_EXCEPTION);

      const reserva = await this.prismaService.reserva.findUnique({
        where: { id_reserva: dto.id_reserva },
        include: { estado_reserva: true },
      });
      if (!reserva || reserva.estado_reserva.nombre_est_res === 'Cancelada') {
        throw new BadRequestException(RESERVA_INVALIDA_PAGO_EXCEPTION);
      }

      // El estado lo pone el servidor, el cliente NO lo envía
      return await this.prismaService.pago.create({
        data: { ...dto, estado: ESTADO_PAGO.COMPLETADO },
        include: INCLUIR,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'crearPago');
    }
  }

  async listarPagos(query: ListarPagosDto) {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const where: Prisma.PagoWhereInput = {
        ...(query.id_reserva ? { id_reserva: query.id_reserva } : {}),
        ...(query.id_met_pago ? { id_met_pago: query.id_met_pago } : {}),
      };
      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.pago.count({ where }),
        this.prismaService.pago.findMany({
          where,
          include: INCLUIR,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { id_pago: 'desc' },
        }),
      ]);
      return paginar(data, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarPagos');
    }
  }

  async buscarUnPago(id_pago: number) {
    try {
      const pago = await this.prismaService.pago.findUnique({
        where: { id_pago },
        include: INCLUIR,
      });
      if (!pago) throw new NotFoundException(NOT_FOUND_BY_ID_EXCEPTION('pago', id_pago));
      return pago;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnPago');
    }
  }

  // NO hay DELETE. Solo anular
  async anularPago(id_pago: number) {
    try {
      const pago = await this.buscarUnPago(id_pago);
      if (pago.estado !== ESTADO_PAGO.COMPLETADO) {
        throw new BadRequestException(PAGO_NO_COMPLETADO_EXCEPTION);
      }
      const facturaEmitida = await this.prismaService.factura.findFirst({
        where: { id_pago, estado: ESTADO_FACTURA.EMITIDA },
      });
      if (facturaEmitida) throw new BadRequestException(PAGO_EN_USO_EXCEPTION);

      return await this.prismaService.pago.update({
        where: { id_pago },
        data: { estado: ESTADO_PAGO.ANULADO },
        include: INCLUIR,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'anularPago');
    }
  }
}