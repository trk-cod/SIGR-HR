import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';
import { ROL_DUPLICADO_EXCEPTION, ROL_INVALIDO_EXCEPTION, ROL_EN_USO_EXCEPTION, PERMISO_INVALIDO_EXCEPTION } from '../message/seguridad.message.js';

@Injectable()
export class RolService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRolDto) {
    const existe = await this.prisma.rol.findFirst({ where: { nombre_rol: dto.nombre } });
    if (existe) throw new BadRequestException(ROL_DUPLICADO_EXCEPTION);

    if (dto.permisosIds?.length) {
      const count = await this.prisma.permiso.count({ where: { id_permiso: { in: dto.permisosIds } } });
      if (count !== dto.permisosIds.length) throw new BadRequestException(PERMISO_INVALIDO_EXCEPTION);
    }

    return this.prisma.rol.create({
      data: {
        nombre_rol: dto.nombre,
        descripcion: dto.descripcion,
        estado: true,
        permisos: dto.permisosIds ? {
          create: dto.permisosIds.map(id_permiso => ({ id_permiso }))
        } : undefined,
      },
      include: { permisos: { include: { permiso: true } } },
    });
  }

  findAll() {
    return this.prisma.rol.findMany({ include: { permisos: { include: { permiso: true } } } });
  }

  async findOne(id_rol: number) {
    const rol = await this.prisma.rol.findUnique({ 
      where: { id_rol }, 
      include: { permisos: { include: { permiso: true } } } 
    });
    if (!rol) throw new NotFoundException(ROL_INVALIDO_EXCEPTION);
    return rol;
  }

  async update(id_rol: number, dto: UpdateRolDto) {
    await this.findOne(id_rol);

    if (dto.permisosIds) {
      await this.prisma.rolPermiso.deleteMany({ where: { id_rol } });
    }

    return this.prisma.rol.update({
      where: { id_rol },
      data: {
        nombre_rol: dto.nombre,
        descripcion: dto.descripcion,
        estado: dto.activo,
        permisos: dto.permisosIds ? {
          create: dto.permisosIds.map(id_permiso => ({ id_permiso }))
        } : undefined,
      },
      include: { permisos: { include: { permiso: true } } },
    });
  }

  async remove(id_rol: number) {
    const usuarios = await this.prisma.usuario.count({ where: { id_rol } });
    if (usuarios > 0) throw new BadRequestException(ROL_EN_USO_EXCEPTION);

    return this.prisma.rol.update({ where: { id_rol }, data: { estado: false } });
  }
}