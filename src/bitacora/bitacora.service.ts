import { Injectable } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';

@Injectable()
export class BitacoraService {
  constructor(private prisma: PrismaService) {}

  async registrar(data: { 
    id_usuario: number; 
    accion: string; 
    descripcion?: string; 
    tabla_afectada?: string;
    registro_id?: string;
  }) {
    return this.prisma.bitacora.create({
      data: {
        id_usuario: data.id_usuario,
        accion: data.accion,
        tabla_afectada: data.tabla_afectada || 'sistema',
        registro_id: data.registro_id?.toString(),
        descripcion: data.descripcion,
        fecha_hora: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.bitacora.findMany({ 
      include: { usuario: true },
      orderBy: { fecha_hora: 'desc' },
    });
  }
}