import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { paginar } from '../common/paginacion.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { ListarBitacoraDto } from './dto/listar-bitacora.dto.js';

@Injectable()
export class BitacoraService {
  private readonly logger = new Logger(BitacoraService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async registrar(datos: {
    id_usuario: number;
    accion: string;
    tabla_afectada: string;
    registro_id?: string | null;
    descripcion?: string;
    ip_equipo?: string;
  }): Promise<void> {
    try {
      await this.prismaService.bitacora.create({
        data: {
          id_usuario: datos.id_usuario,
          accion: datos.accion,
          tabla_afectada: datos.tabla_afectada,
          registro_id: datos.registro_id ?? null,
          descripcion: datos.descripcion?.slice(0, 300),
          ip_equipo: datos.ip_equipo?.slice(0, 45),
        },
      });
    } catch (error) {
      this.logger.error(
        `No se pudo registrar en bitácora: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async listarBitacora(query: ListarBitacoraDto) {
    try {
      const { page, limit, id_usuario, tabla_afectada } = query;

      const where: Prisma.BitacoraWhereInput = {
        ...(id_usuario ? { id_usuario } : {}),
        ...(tabla_afectada ? { tabla_afectada } : {}),
      };

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.bitacora.count({ where }),
        this.prismaService.bitacora.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { fecha_hora: 'desc' },
        }),
      ]);

      return paginar(data, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarBitacora');
    }
  }
}