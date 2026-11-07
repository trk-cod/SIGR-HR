import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { ListarReservasDto } from './dto/listar-reservas.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { DisponibilidadReservaDto } from './dto/disponibilidad-reserva.dto.js';
import { paginar } from '../common/paginacion.js';
import { handlePrismaError } from '../common/prisma-error.js';

import {
  RESERVA_HUESPED_INACTIVO,
  RESERVA_EMPLEADO_INACTIVO,
  RESERVA_FECHAS_INVALIDAS,
  RESERVA_HABITACION_NO_DISPONIBLE,
  RESERVA_CAPACIDAD_INSUFICIENTE,
  RESERVA_FECHAS_SUPERPUESTAS,
  RESERVA_NO_ENCONTRADA,
  RESERVA_ESTADO_INVALIDO,
  RESERVA_RANGO_FECHAS_INVALIDO,
  RESERVA_SIN_CAMPOS_ACTUALIZAR,
  RESERVA_ESTADO_NO_REGISTRADO,
} from '../message/message.js';

@Injectable()
export class ReservaService {
  private readonly logger = new Logger(ReservaService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private validarFechas(
    fecha_entrada: string,
    fecha_salida: string,
  ): { entrada: Date; salida: Date } {
    const entrada = new Date(`${fecha_entrada}T00:00:00.000Z`);
    const salida = new Date(`${fecha_salida}T00:00:00.000Z`);
    const hoy = new Date();
    hoy.setUTCHours(0, 0, 0, 0);

    if (
      Number.isNaN(entrada.getTime()) ||
      Number.isNaN(salida.getTime()) ||
      entrada < hoy ||
      salida <= entrada
    ) {
      throw new BadRequestException(RESERVA_FECHAS_INVALIDAS);
    }

    return { entrada, salida };
  }

  private async validarHuespedYEmpleado(
    tx: Prisma.TransactionClient,
    dto: CreateReservaDto,
  ): Promise<void> {
    const huesped = await tx.huesped.findFirst({
      where: {
        id_huesped: dto.id_huesped,
        estado: true,
      },
      select: { id_huesped: true },
    });

    if (!huesped) {
      throw new BadRequestException(RESERVA_HUESPED_INACTIVO);
    }

    const empleado = await tx.empleado.findFirst({
      where: {
        id_empleado: dto.id_empleado,
        estado: true,
      },
      select: { id_empleado: true },
    });

    if (!empleado) {
      throw new BadRequestException(RESERVA_EMPLEADO_INACTIVO);
    }
  }

  private async validarHabitaciones(
    tx: Prisma.TransactionClient,
    habitaciones: number[],
    entrada: Date,
    salida: Date,
    cantidad_personas: number,
  ): Promise<void> {
    const registros = await tx.habitacion.findMany({
      where: {
        id_habitacion: { in: habitaciones },
      },
      include: {
        tipo: true,
        estado_actual: true,
      },
    });

    if (registros.length !== habitaciones.length) {
      throw new BadRequestException(
        RESERVA_HABITACION_NO_DISPONIBLE,
      );
    }

    const noDisponibles = registros.some(
      (habitacion) =>
        habitacion.estado_actual.nombre_estado !== 'Disponible',
    );

    if (noDisponibles) {
      throw new BadRequestException(
        RESERVA_HABITACION_NO_DISPONIBLE,
      );
    }

    const capacidadTotal = registros.reduce(
      (total, habitacion) => total + habitacion.tipo.capacidad,
      0,
    );

    if (capacidadTotal < cantidad_personas) {
      throw new BadRequestException(
        RESERVA_CAPACIDAD_INSUFICIENTE,
      );
    }

    const reservaExistente = await tx.reserva.findFirst({
      where: {
        fecha_entrada: { lt: salida },
        fecha_salida: { gt: entrada },
        estado_reserva: {
          nombre_est_res: {
            in: ['Pendiente', 'Confirmada'],
          },
        },
        detalles: {
          some: {
            id_habitacion: { in: habitaciones },
          },
        },
      },
      select: { id_reserva: true },
    });

    if (reservaExistente) {
      throw new ConflictException(
        RESERVA_FECHAS_SUPERPUESTAS,
      );
    }
  }

  async crearReserva(dto: CreateReservaDto) {
    try {
      const { entrada, salida } = this.validarFechas(
        dto.fecha_entrada,
        dto.fecha_salida,
      );

      return await this.prismaService.$transaction(
        async (tx) => {
          await this.validarHuespedYEmpleado(tx, dto);

          await this.validarHabitaciones(
            tx,
            dto.habitaciones,
            entrada,
            salida,
            dto.cantidad_personas,
          );

          const estadoPendiente = await tx.estadoReserva.findFirst({
            where: { nombre_est_res: 'Pendiente' },
          });

          if (!estadoPendiente) {
            throw new BadRequestException(RESERVA_ESTADO_INVALIDO);
          }

          return tx.reserva.create({
            data: {
              fecha_entrada: entrada,
              fecha_salida: salida,
              cantidad_personas: dto.cantidad_personas,
              observaciones: dto.observaciones,
              huesped: {
                connect: { id_huesped: dto.id_huesped },
              },
              empleado: {
                connect: { id_empleado: dto.id_empleado },
              },
              estado_reserva: {
                connect: {
                  id_est_reserva: estadoPendiente.id_est_reserva,
                },
              },
              detalles: {
                create: dto.habitaciones.map((id_habitacion) => ({
                  habitacion: {
                    connect: { id_habitacion },
                  },
                })),
              },
            },
            include: {
              huesped: true,
              empleado: true,
              estado_reserva: true,
              detalles: {
                include: { habitacion: true },
              },
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        throw new ConflictException(RESERVA_FECHAS_SUPERPUESTAS);
      }

      handlePrismaError(error, this.logger, 'crearReserva');
    }
  }
  async listarReservas(filtros: ListarReservasDto) {
    try {
      const {
        page = 1,
        limit = 10,
        id_est_reserva,
        id_huesped,
        fecha_entrada_desde,
        fecha_entrada_hasta,
      } = filtros;

      if (
        fecha_entrada_desde &&
        fecha_entrada_hasta &&
        new Date(fecha_entrada_desde) > new Date(fecha_entrada_hasta)
      ) {
        throw new BadRequestException(
          RESERVA_RANGO_FECHAS_INVALIDO,
        );
      }

      const where: Prisma.ReservaWhereInput = {
        ...(id_est_reserva !== undefined && {
          id_est_reserva,
        }),
        ...(id_huesped && {
          id_huesped,
        }),
        ...(fecha_entrada_desde || fecha_entrada_hasta
          ? {
              fecha_entrada: {
                ...(fecha_entrada_desde && {
                  gte: new Date(fecha_entrada_desde),
                }),
                ...(fecha_entrada_hasta && {
                  lte: new Date(fecha_entrada_hasta),
                }),
              },
            }
          : {}),
      };

      const [reservas, total] = await this.prismaService.$transaction([
        this.prismaService.reserva.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            fecha_reserva: 'desc',
          },
          include: {
            huesped: true,
            empleado: true,
            estado_reserva: true,
            detalles: {
              include: {
                habitacion: {
                  include: {
                    tipo: true,
                    estado_actual: true,
                  },
                },
              },
            },
          },
        }),
        this.prismaService.reserva.count({ where }),
      ]);

      return paginar(reservas, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarReservas');
    }
  }

  async buscarUnaReserva(id: number) {
    try {
      const reserva = await this.prismaService.reserva.findUnique({
        where: {
          id_reserva: id,
        },
        include: {
          huesped: true,
          empleado: true,
          estado_reserva: true,
          detalles: {
            include: {
              habitacion: {
                include: {
                  tipo: true,
                  estado_actual: true,
                },
              },
            },
          },
        },
      });

      if (!reserva) {
        throw new NotFoundException(RESERVA_NO_ENCONTRADA);
      }

      return reserva;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnaReserva');
    }
  }

  async consultarDisponibilidad(dto: DisponibilidadReservaDto) {
    try {
      const { entrada, salida } = this.validarFechas(
        dto.fecha_entrada,
        dto.fecha_salida,
      );

      return await this.prismaService.habitacion.findMany({
        where: {
          estado_actual: {
            nombre_estado: 'Disponible',
          },
          detalle_reservas: {
            none: {
              reserva: {
                is: {
                  fecha_entrada: { lt: salida },
                  fecha_salida: { gt: entrada },
                  estado_reserva: {
                    nombre_est_res: {
                      in: ['Pendiente', 'Confirmada'],
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          tipo: true,
          estado_actual: true,
        },
        orderBy: {
          numero_habitacion: 'asc',
        },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'consultarDisponibilidad');
    }
  }
  async confirmarReserva(id: number) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const reserva = await tx.reserva.findUnique({
          where: { id_reserva: id },
          include: { estado_reserva: true },
        });

        if (!reserva) {
          throw new NotFoundException(RESERVA_NO_ENCONTRADA);
        }

        if (reserva.estado_reserva.nombre_est_res !== 'Pendiente') {
          throw new BadRequestException(RESERVA_ESTADO_INVALIDO);
        }

        const estadoConfirmada = await tx.estadoReserva.findFirst({
          where: { nombre_est_res: 'Confirmada' },
        });

        if (!estadoConfirmada) {
          throw new BadRequestException(
            RESERVA_ESTADO_NO_REGISTRADO('Confirmada'),
          );
        }

                await tx.reserva.update({
          where: { id_reserva: id },
          data: { id_est_reserva: estadoConfirmada.id_est_reserva },
        });

        return tx.reserva.findUnique({
          where: { id_reserva: id },
          include: {
            huesped: true,
            empleado: true,
            estado_reserva: true,
            detalles: {
              include: {
                habitacion: {
                  include: {
                    tipo: true,
                    estado_actual: true,
                  },
                },
              },
            },
                   },
        });
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'confirmarReserva');
    }
  }
  async cancelarReserva(id: number) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const reserva = await tx.reserva.findUnique({
          where: { id_reserva: id },
          include: { estado_reserva: true },
        });

        if (!reserva) {
          throw new NotFoundException(RESERVA_NO_ENCONTRADA);
        }

        if (
          !['Pendiente', 'Confirmada'].includes(
            reserva.estado_reserva.nombre_est_res,
          )
        ) {
          throw new BadRequestException(RESERVA_ESTADO_INVALIDO);
        }

        const estadoCancelada = await tx.estadoReserva.findFirst({
          where: { nombre_est_res: 'Cancelada' },
        });

        if (!estadoCancelada) {
          throw new BadRequestException(
            RESERVA_ESTADO_NO_REGISTRADO('Cancelada'),
          );
        }

        return tx.reserva.update({
          where: { id_reserva: id },
          data: { id_est_reserva: estadoCancelada.id_est_reserva },
          include: {
            huesped: true,
            empleado: true,
            estado_reserva: true,
            detalles: {
              include: {
                habitacion: {
                  include: {
                    tipo: true,
                    estado_actual: true,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'cancelarReserva');
    }
  }
  async actualizarReserva(id: number, dto: UpdateReservaDto) {
    try {
      if (Object.keys(dto).length === 0) {
        throw new BadRequestException(
          RESERVA_SIN_CAMPOS_ACTUALIZAR,
        );
      }

      return await this.prismaService.$transaction(async (tx) => {
        const reserva = await tx.reserva.findUnique({
          where: { id_reserva: id },
          include: {
            estado_reserva: true,
            detalles: {
              include: {
                habitacion: {
                  include: {
                    tipo: true,
                  },
                },
              },
            },
          },
        });

        if (!reserva) {
          throw new NotFoundException(RESERVA_NO_ENCONTRADA);
        }

        if (reserva.estado_reserva.nombre_est_res !== 'Pendiente') {
          throw new BadRequestException(RESERVA_ESTADO_INVALIDO);
        }

        if (dto.cantidad_personas !== undefined) {
          const capacidadTotal = reserva.detalles.reduce(
            (total, detalle) =>
              total + detalle.habitacion.tipo.capacidad,
            0,
          );

          if (capacidadTotal < dto.cantidad_personas) {
            throw new BadRequestException(
              RESERVA_CAPACIDAD_INSUFICIENTE,
            );
          }
        }

        return tx.reserva.update({
          where: { id_reserva: id },
          data: {
            ...(dto.cantidad_personas !== undefined && {
              cantidad_personas: dto.cantidad_personas,
            }),
            ...(dto.observaciones !== undefined && {
              observaciones: dto.observaciones,
            }),
          },
          include: {
            huesped: true,
            empleado: true,
            estado_reserva: true,
            detalles: {
              include: {
                habitacion: {
                  include: {
                    tipo: true,
                    estado_actual: true,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'actualizarReserva');
    }
  }
}
