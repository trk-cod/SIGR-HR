import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';
import type { Prisma } from '../generated/prisma/client.js';
import { CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto.js';
import { ListarEmpleadosDto } from './dto/listar-empleados.dto.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { paginar } from '../common/paginacion.js';
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  CARGO_INVALIDO_EXCEPTION,
  EMPLEADO_DUPLICADO_EXCEPTION,
  EMPLEADO_MENOR_EXCEPTION,
} from '../message/message.js';

const INCLUIR = {
  cargo: { select: { id_cargo: true, nombre_car: true } },
} satisfies Prisma.EmpleadoInclude;

@Injectable()
export class EmpleadoService {
  private readonly logger = new Logger(EmpleadoService.name);

  constructor(private readonly prismaService: PrismaService) {}

  private async validarCargo(id_cargo: number) {
    const cargo = await this.prismaService.cargo.findUnique({ where: { id_cargo } });
    if (!cargo || !cargo.estado) throw new BadRequestException(CARGO_INVALIDO_EXCEPTION);
  }

  private validarEdad(nacimiento: Date) {
    const hoy = new Date();
    let edad = hoy.getUTCFullYear() - nacimiento.getUTCFullYear();
    const m = hoy.getUTCMonth() - nacimiento.getUTCMonth();
    if (m < 0 || (m === 0 && hoy.getUTCDate() < nacimiento.getUTCDate())) edad--;
    if (edad < 18) throw new BadRequestException(EMPLEADO_MENOR_EXCEPTION);
  }

  async crearEmpleado(dto: CreateEmpleadoDto) {
    try {
      await this.validarCargo(dto.id_cargo);
      this.validarEdad(dto.fecha_nac_emp);
      return await this.prismaService.empleado.create({ data: dto, include: INCLUIR });
    } catch (error) {
      handlePrismaError(error, this.logger, 'crearEmpleado', EMPLEADO_DUPLICADO_EXCEPTION);
    }
  }

    async listarEmpleados(query: ListarEmpleadosDto) {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const { search } = query;
      const where: Prisma.EmpleadoWhereInput = search
        ? {
            OR: [
              { nombre_em: { contains: search, mode: 'insensitive' } },
              { apellido_em: { contains: search, mode: 'insensitive' } },
              { cedula_em: { contains: search } },
            ],
          }
        : {};
      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.empleado.count({ where }),
        this.prismaService.empleado.findMany({
          where,
          include: INCLUIR,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { apellido_em: 'asc' },
        }),
      ]);
      return paginar(data, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarEmpleados');
    }
  }

  async buscarUnEmpleado(id_empleado: number) {
    try {
      const empleado = await this.prismaService.empleado.findUnique({
        where: { id_empleado },
        include: INCLUIR,
      });
      if (!empleado) {
        throw new NotFoundException(NOT_FOUND_BY_ID_EXCEPTION('empleado', id_empleado));
      }
      return empleado;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnEmpleado');
    }
  }

  async actualizarEmpleado(id_empleado: number, dto: UpdateEmpleadoDto) {
    try {
      await this.buscarUnEmpleado(id_empleado);
      if (dto.id_cargo !== undefined) await this.validarCargo(dto.id_cargo);
      if (dto.fecha_nac_emp !== undefined) this.validarEdad(dto.fecha_nac_emp);
      return await this.prismaService.empleado.update({
        where: { id_empleado },
        data: dto,
        include: INCLUIR,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'actualizarEmpleado', EMPLEADO_DUPLICADO_EXCEPTION);
    }
  }

  async desactivarEmpleado(id_empleado: number) {
    try {
      await this.buscarUnEmpleado(id_empleado);
      return await this.prismaService.empleado.update({
        where: { id_empleado },
        data: { estado: false },
        include: INCLUIR,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'desactivarEmpleado');
    }
  }
}