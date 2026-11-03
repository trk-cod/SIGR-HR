import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';
import { CreateCargoDto } from './dto/create-cargo.dto.js';
import { UpdateCargoDto } from './dto/update-cargo.dto.js';
import { handlePrismaError } from '../common/prisma-error.js';
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  CARGO_DUPLICADO_EXCEPTION,
  CARGO_EN_USO_EXCEPTION,
} from '../message/message.js';

@Injectable()
export class CargoService {
  private readonly logger = new Logger(CargoService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async crearCargo(dto: CreateCargoDto) {
    try {
      return await this.prismaService.cargo.create({ data: dto });
    } catch (error) {
      handlePrismaError(error, this.logger, 'crearCargo', CARGO_DUPLICADO_EXCEPTION);
    }
  }

  async listarCargos() {
    try {
      return await this.prismaService.cargo.findMany({ orderBy: { nombre_car: 'asc' } });
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarCargos');
    }
  }

  async buscarUnCargo(id_cargo: number) {
    try {
      const cargo = await this.prismaService.cargo.findUnique({ where: { id_cargo } });
      if (!cargo) throw new NotFoundException(NOT_FOUND_BY_ID_EXCEPTION('cargo', id_cargo));
      return cargo;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnCargo');
    }
  }

  async actualizarCargo(id_cargo: number, dto: UpdateCargoDto) {
    try {
      await this.buscarUnCargo(id_cargo);
      return await this.prismaService.cargo.update({ where: { id_cargo }, data: dto });
    } catch (error) {
      handlePrismaError(error, this.logger, 'actualizarCargo', CARGO_DUPLICADO_EXCEPTION);
    }
  }

  async desactivarCargo(id_cargo: number) {
    try {
      await this.buscarUnCargo(id_cargo);
      const activos = await this.prismaService.empleado.count({
        where: { id_cargo, estado: true },
      });
      if (activos > 0) throw new BadRequestException(CARGO_EN_USO_EXCEPTION);
      return await this.prismaService.cargo.update({
        where: { id_cargo },
        data: { estado: false },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'desactivarCargo');
    }
  }
}