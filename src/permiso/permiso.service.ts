import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';
import { handlePrismaError } from '../common/prisma-error.js';

@Injectable()
export class PermisoService {
  private readonly logger = new Logger(PermisoService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async listarPermisos() {
    try {
      return await this.prismaService.permiso.findMany({ orderBy: { nombre_permiso: 'asc' } });
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarPermisos');
    }
  }
}