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
  }
}