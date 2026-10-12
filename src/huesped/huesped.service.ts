
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaClient } from '../generated/prisma/client.js';
import type { Huesped } from '../generated/prisma/client.js';
import { CreateHuespedDto } from './dto/create-huesped.dto.js';
import { UpdateHuespedDto } from './dto/update-huesped.dto.js';

@Injectable()
export class HuespedService {
  constructor(private readonly prismaService: PrismaService) {}

  async crearHuesped(dto: CreateHuespedDto): Promise<Huesped> {
    try {
      return await this.prismaService.huesped.create({
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe un huésped con esa identificación o correo.',
        );
      }

      throw error;
    }
  }

  async listarHuespedes(): Promise<Huesped[]> {
    return await this.prismaService.huesped.findMany();
  }

  async buscarUnHuesped(id_huesped: number): Promise<Huesped> {
    const huesped = await this.prismaService.huesped.findUnique({
      where: { id_huesped },
    });

    if (!huesped) {
      throw new NotFoundException(
        `No se encontró el huésped con el id: ${id_huesped}`,
      );
    }

    return huesped;
  }

  async actualizarHuesped(
    id_huesped: number,
    dto: UpdateHuespedDto,
  ): Promise<Huesped> {
    await this.buscarUnHuesped(id_huesped);

    return await this.prismaService.huesped.update({
      where: { id_huesped },
      data: dto,
    });
  }

  // Baja lógica: conserva el registro si tiene reservas asociadas.
  async desactivarHuesped(id_huesped: number): Promise<Huesped> {
    await this.buscarUnHuesped(id_huesped);

    return await this.prismaService.huesped.update({
      where: { id_huesped },
      data: { estado: false },
    });
  }
}

