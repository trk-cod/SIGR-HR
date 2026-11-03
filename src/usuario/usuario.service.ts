<<<<<<< HEAD
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../message/prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    const existe = await this.prisma.usuario.findFirst({ 
      where: { nombre_usuario: dto.nombre_usuario } 
    });
    if (existe) throw new BadRequestException('USUARIO_DUPLICADO');

    const rol = await this.prisma.rol.findUnique({ where: { id_rol: dto.id_rol } });
    if (!rol) throw new BadRequestException('ROL_INVALIDO');

    const hash = await bcrypt.hash(dto.contrasena_usuario, 10);

    return this.prisma.usuario.create({
      data: {
        nombre_usuario: dto.nombre_usuario,
        contrasena_usuario: hash,
        id_rol: dto.id_rol,
      },
      include: { rol: true },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({ 
      where: { estado: true },
      include: { rol: true } 
    });
  }

  async findOne(id_usuario: number) {
    const user = await this.prisma.usuario.findUnique({ 
      where: { id_usuario },
      include: { rol: { include: { permisos: { include: { permiso: true } } } } }
    });
    if (!user) throw new NotFoundException('USUARIO_INVALIDO');
    return user;
  }

  async update(id_usuario: number, dto: UpdateUsuarioDto) {
    await this.findOne(id_usuario);
    
    let data: any = { ...dto };
    if (dto.contrasena_usuario) {
      data.contrasena_usuario = await bcrypt.hash(dto.contrasena_usuario, 10);
    }

    return this.prisma.usuario.update({
      where: { id_usuario },
      data,
      include: { rol: true },
    });
  }

  async remove(id_usuario: number) {
    await this.findOne(id_usuario);
    return this.prisma.usuario.update({ where: { id_usuario }, data: { estado: false } });
  }
  
  // Este lo necesita el Auth después
  async findByNombre(nombre_usuario: string) {
    return this.prisma.usuario.findUnique({ 
      where: { nombre_usuario },
      include: { rol: { include: { permisos: { include: { permiso: true } } } } }
    });
=======
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { handlePrismaError } from '../common/prisma-error.js';
import { paginar } from '../common/paginacion.js';

import {
  NOT_FOUND_BY_ID_EXCEPTION,
  ROL_INVALIDO_EXCEPTION,
  USUARIO_DUPLICADO_EXCEPTION,
  CONTRASENA_ACTUAL_INCORRECTA_EXCEPTION,
  NO_AUTODESACTIVAR_EXCEPTION,
} from '../message/message.js';

import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { CambiarContrasenaDto } from './dto/cambiar-contrasena.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';

// Campos permitidos en las respuestas.
// Nunca incluir contrasena_usuario.
const USUARIO_PUBLICO = {
  id_usuario: true,
  nombre_usuario: true,
  id_rol: true,
  ultimo_acceso: true,
  estado: true,
  rol: {
    select: {
      id_rol: true,
      nombre_rol: true,
    },
  },
} satisfies Prisma.UsuarioSelect;

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);
  private readonly saltRounds: number;

  constructor(
    private readonly prismaService: PrismaService,
    configService: ConfigService,
  ) {
    this.saltRounds = Number(
      configService.get('BCRYPT_SALT_ROUNDS') ?? 10,
    );
  }

  async crearUsuario(dto: CreateUsuarioDto) {
    try {
      const rol = await this.prismaService.rol.findUnique({
        where: { id_rol: dto.id_rol },
      });

      if (!rol || !rol.estado) {
        throw new BadRequestException(ROL_INVALIDO_EXCEPTION);
      }

      const hash = await bcrypt.hash(
        dto.contrasena_usuario,
        this.saltRounds,
      );

      return await this.prismaService.usuario.create({
        data: {
          ...dto,
          contrasena_usuario: hash,
        },
        select: USUARIO_PUBLICO,
      });
    } catch (error) {
      handlePrismaError(
        error,
        this.logger,
        'crearUsuario',
        USUARIO_DUPLICADO_EXCEPTION,
      );
    }
  }

  async listarUsuarios(query: ListarUsuariosDto) {
    try {
      const { page, limit, search } = query;

      const where: Prisma.UsuarioWhereInput = search
        ? {
            nombre_usuario: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {};

      const [total, data] = await this.prismaService.$transaction([
        this.prismaService.usuario.count({ where }),
        this.prismaService.usuario.findMany({
          where,
          select: USUARIO_PUBLICO,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { nombre_usuario: 'asc' },
        }),
      ]);

      return paginar(data, total, page, limit);
    } catch (error) {
      handlePrismaError(error, this.logger, 'listarUsuarios');
    }
  }

  async buscarUnUsuario(id_usuario: number) {
    try {
      const usuario = await this.prismaService.usuario.findUnique({
        where: { id_usuario },
        select: USUARIO_PUBLICO,
      });

      if (!usuario) {
        throw new NotFoundException(
          NOT_FOUND_BY_ID_EXCEPTION('usuario', id_usuario),
        );
      }

      return usuario;
    } catch (error) {
      handlePrismaError(error, this.logger, 'buscarUnUsuario');
    }
  }

  async actualizarUsuario(id_usuario: number, dto: UpdateUsuarioDto) {
    try {
      if (dto.id_rol !== undefined) {
        const rol = await this.prismaService.rol.findUnique({
          where: { id_rol: dto.id_rol },
        });

        if (!rol || !rol.estado) {
          throw new BadRequestException(ROL_INVALIDO_EXCEPTION);
        }
      }

      return await this.prismaService.usuario.update({
        where: { id_usuario },
        data: dto,
        select: USUARIO_PUBLICO,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'actualizarUsuario');
    }
  }

  async cambiarContrasena(
    id_usuario: number,
    dto: CambiarContrasenaDto,
  ) {
    try {
      const usuario = await this.prismaService.usuario.findUnique({
        where: { id_usuario },
        select: { contrasena_usuario: true },
      });

      if (!usuario) {
        throw new NotFoundException(
          NOT_FOUND_BY_ID_EXCEPTION('usuario', id_usuario),
        );
      }

      const coincide = await bcrypt.compare(
        dto.contrasena_actual,
        usuario.contrasena_usuario,
      );

      if (!coincide) {
        throw new BadRequestException(
          CONTRASENA_ACTUAL_INCORRECTA_EXCEPTION,
        );
      }

      const hash = await bcrypt.hash(
        dto.contrasena_nueva,
        this.saltRounds,
      );

      await this.prismaService.usuario.update({
        where: { id_usuario },
        data: { contrasena_usuario: hash },
      });

      return { message: 'Contraseña actualizada' };
    } catch (error) {
      handlePrismaError(error, this.logger, 'cambiarContrasena');
    }
  }

  async desactivarUsuario(
    id_usuario: number,
    id_usuario_actual: number,
  ) {
    try {
      if (id_usuario === id_usuario_actual) {
        throw new BadRequestException(NO_AUTODESACTIVAR_EXCEPTION);
      }

      return await this.prismaService.usuario.update({
        where: { id_usuario },
        data: { estado: false },
        select: USUARIO_PUBLICO,
      });
    } catch (error) {
      handlePrismaError(error, this.logger, 'desactivarUsuario');
    }
>>>>>>> equipo/develop
  }
}