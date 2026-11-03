<<<<<<< HEAD
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
=======

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { handlePrismaError } from '../common/prisma-error.js';
import {
  NOT_FOUND_BY_ID_EXCEPTION,
  ROL_DUPLICADO_EXCEPTION,
  ROL_EN_USO_EXCEPTION,
  PERMISO_INVALIDO_EXCEPTION,
} from '../message/message.js';

import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';
import { AsignarPermisosDto } from './dto/asignar-permisos.dto.js';

@Injectable()
export class RolService {
  private readonly logger = new Logger(RolService.name);

  constructor(private readonly prismaService: PrismaService) {}

  // Crear un rol
  async crearRol(dto: CreateRolDto) {
    try {
      return await this.prismaService.rol.create({
        data: dto,
      });
    } catch (error) {
      handlePrismaError(
        error,
        this.logger,
        'crearRol',
        ROL_DUPLICADO_EXCEPTION,
      );
    }
  }

  // Listar todos los roles
  async listarRoles() {
    try {
      return await this.prismaService.rol.findMany({
        include: {
          _count: {
            select: {
              usuarios: true,
              permisos: true,
            },
          },
        },
        orderBy: {
          nombre_rol: 'asc',
        },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarRoles');
    }
  }

  // Buscar un rol por su ID
  async buscarUnRol(id_rol: number) {
    try {
      const rol = await this.prismaService.rol.findUnique({
        where: { id_rol },
        include: {
          permisos: {
            include: {
              permiso: true,
            },
          },
        },
      });

      if (!rol) {
        throw new NotFoundException(
          NOT_FOUND_BY_ID_EXCEPTION('rol', id_rol),
        );
      }

      return rol;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnRol');
    }
  }

  // Actualizar un rol
  async actualizarRol(id_rol: number, dto: UpdateRolDto) {
    try {
      await this.buscarUnRol(id_rol);

      return await this.prismaService.rol.update({
        where: { id_rol },
        data: dto,
      });
    } catch (error) {
      handlePrismaError(
        error,
        this.logger,
        'actualizarRol',
        ROL_DUPLICADO_EXCEPTION,
      );
    }
  }

  // Desactivar un rol
  async desactivarRol(id_rol: number) {
    try {
      await this.buscarUnRol(id_rol);

      const usuariosActivos = await this.prismaService.usuario.count({
        where: {
          id_rol,
          estado: true,
        },
      });

      if (usuariosActivos > 0) {
        throw new BadRequestException(ROL_EN_USO_EXCEPTION);
      }

      return await this.prismaService.rol.update({
        where: { id_rol },
        data: { estado: false },
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'desactivarRol');
    }
  }

  // Reemplazar todos los permisos asignados a un rol
  async asignarPermisos(
    id_rol: number,
    dto: AsignarPermisosDto,
  ) {
    try {
      await this.buscarUnRol(id_rol);

      const ids: number[] = [...new Set<number>(dto.permisoIds)];
      const existentes = await this.prismaService.permiso.count({
        where: {
          id_permiso: {
            in: ids,
          },
        },
      });

      if (existentes !== ids.length) {
        throw new BadRequestException(PERMISO_INVALIDO_EXCEPTION);
      }

      await this.prismaService.$transaction([
        this.prismaService.rolPermiso.deleteMany({
          where: { id_rol },
        }),
        this.prismaService.rolPermiso.createMany({
          data: ids.map((id_permiso) => ({
            id_rol,
            id_permiso,
          })),
        }),
      ]);

      return await this.buscarUnRol(id_rol);
    } catch (error) {
      handlePrismaError(error, this.logger, 'asignarPermisos');
    }
  }
}
>>>>>>> equipo/develop
