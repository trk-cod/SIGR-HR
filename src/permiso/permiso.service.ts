import { Injectable, Logger } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaService } from '../message/prisma/prisma.service.js';
=======
import { PrismaService } from '../prisma/prisma.service.js';
>>>>>>> equipo/develop
import { handlePrismaError } from '../common/prisma-error.js';

@Injectable()
export class PermisoService {
  private readonly logger = new Logger(PermisoService.name);
<<<<<<< HEAD
=======

>>>>>>> equipo/develop
  constructor(private readonly prismaService: PrismaService) {}

  async listarPermisos() {
    try {
<<<<<<< HEAD
      return await this.prismaService.permiso.findMany({ orderBy: { nombre_permiso: 'asc' } });
=======
      return await this.prismaService.permiso.findMany({
        orderBy: {
          nombre_permiso: 'asc',
        },
      });
>>>>>>> equipo/develop
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarPermisos');
    }
  }
}