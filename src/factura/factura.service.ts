import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../message/prisma/prisma.service.js';
import { CreateFacturaDto } from './dto/create-factura.dto.js';
import { ListarFacturasDto } from './dto/listar-facturas.dto.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { paginar } from '../common/paginacion.js';
import { ESTADO_FACTURA, ESTADO_PAGO, TASA_ITBIS } from '../common/estados.js';
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  PAGO_INVALIDO_EXCEPTION,
  TARIFA_NO_ENCONTRADA_EXCEPTION,
  FACTURA_NO_ANULABLE_EXCEPTION,
} from '../message/message.js';

@Injectable()
export class FacturaService {
  private readonly logger = new Logger(FacturaService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async crearFactura(dto: CreateFacturaDto) {
    try {
      return await this.prismaService.$transaction(
        async (tx) => {
          // 1. Valida que el pago pertenezca a la reserva y esté Completado
          const pago = await tx.pago.findUnique({ where: { id_pago: dto.id_pago } });
          if (!pago || pago.id_reserva !== dto.id_reserva || pago.estado !== ESTADO_PAGO.COMPLETADO) {
            throw new BadRequestException(PAGO_INVALIDO_EXCEPTION);
          }

          const reserva = await tx.reserva.findUnique({
            where: { id_reserva: dto.id_reserva },
            include: { detalles: { include: { habitacion: true } } },
          });
          if (!reserva) throw new NotFoundException(NOT_FOUND_BY_ID_EXCEPTION('reserva', dto.id_reserva));

          // 2. Calcula las noches
          const MS_DIA = 24 * 60 * 60 * 1000;
          const noches = Math.round((reserva.fecha_salida.getTime() - reserva.fecha_entrada.getTime()) / MS_DIA);

          // 3. Agrupa habitaciones por tipo
          const porTipo = new Map<number, number>();
          for (const d of reserva.detalles) {
            porTipo.set(d.habitacion.id_tipo, (porTipo.get(d.habitacion.id_tipo) ?? 0) + 1);
          }

          // 4. Busca tarifa vigente y crea lineas de DetalleFactura
          let subtotal = new Prisma.Decimal(0);
          const lineas: Prisma.DetalleFacturaUncheckedCreateWithoutFacturaInput[] = [];

          for (const [id_thabitacion, cantidad] of porTipo) {
            const tarifa = await tx.tarifa.findFirst({
              where: {
                id_thabitacion,
                estado: true,
                fecha_inicio: { lte: reserva.fecha_entrada },
                fecha_fin: { gte: reserva.fecha_entrada },
              },
            });
            if (!tarifa) throw new BadRequestException(TARIFA_NO_ENCONTRADA_EXCEPTION);

            lineas.push({
              id_thabitacion,
              cantidad_habitaciones: cantidad,
              cantidad_noches: noches,
              precio_noche: tarifa.precio_noche,
            });
            subtotal = subtotal.add(tarifa.precio_noche.mul(cantidad).mul(noches));
          }

          // 5. Calcula ITBIS 18% y total con Decimal, NUNCA con Number
          const itbis = subtotal.mul(TASA_ITBIS).toDecimalPlaces(2);
          const total = subtotal.add(itbis);

          // Número consecutivo FAC-2026-000001
          const ultima = await tx.factura.findFirst({
            orderBy: { id_factura: 'desc' },
            select: { id_factura: true },
          });
          const consecutivo = String((ultima?.id_factura ?? 0) + 1).padStart(6, '0');

          // 6. Guarda factura + detalles en una sola transacción
          return tx.factura.create({
            data: {
              numero_factura: `FAC-${new Date().getUTCFullYear()}-${consecutivo}`,
              tipo_factura: dto.tipo_factura,
              rcf: dto.rcf,
              id_reserva: dto.id_reserva,
              id_pago: dto.id_pago,
              id_empleado: dto.id_empleado,
              subtotal,
              itbis,
              total,
              estado: ESTADO_FACTURA.EMITIDA,
              detalles: { create: lineas },
            },
            include: { detalles: true },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      handlePrismaError(error, this.logger, 'crearFactura');
    }
  }

  async listarFacturas(query: ListarFacturasDto) {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const where: Prisma.FacturaWhereInput = query.id_reserva ? { id_reserva: query.id_reserva } : {};
      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.factura.count({ where }),
        this.prismaService.factura.findMany({
          where,
          include: { detalles: true },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { id_factura: 'desc' },
        }),
      ]);
      return paginar(data, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarFacturas');
    }
  }

  async buscarUnaFactura(id_factura: number) {
    try {
      const factura = await this.prismaService.factura.findUnique({
        where: { id_factura },
        include: { detalles: true },
      });
      if (!factura) throw new NotFoundException(NOT_FOUND_BY_ID_EXCEPTION('factura', id_factura));
      return factura;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnaFactura');
    }
  }

  // Las facturas NO se borran, solo se anulan
  async anularFactura(id_factura: number) {
    try {
      const factura = await this.buscarUnaFactura(id_factura);
      if (factura.estado !== ESTADO_FACTURA.EMITIDA) {
        throw new BadRequestException(FACTURA_NO_ANULABLE_EXCEPTION);
      }
      return await this.prismaService.factura.update({
        where: { id_factura },
        data: { estado: ESTADO_FACTURA.ANULADA },
        include: { detalles: true },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'anularFactura');
    }
  }
}