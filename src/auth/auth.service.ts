<<<<<<< HEAD
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service.js';
import { BitacoraService } from '../bitacora/bitacora.service.js';
import { PrismaService } from '../message/prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
=======
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service.js';
import { BitacoraService } from '../bitacora/bitacora.service.js';

import { LoginDto } from './dto/login.dto.js';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';

import { INVALID_CREDENTIALS_EXCEPTION } from '../message/message.js';

const HASH_FALSO = bcrypt.hashSync(
  'contrasena-que-no-existe',
  10,
);
>>>>>>> equipo/develop

@Injectable()
export class AuthService {
  constructor(
<<<<<<< HEAD
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bitacoraService: BitacoraService,
    private prisma: PrismaService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioService.findByNombre(dto.nombre_usuario);
    if (!usuario) throw new UnauthorizedException('CREDENCIALES_INVALIDAS');
    if (!usuario.estado) throw new UnauthorizedException('USUARIO_INACTIVO');

    const ok = await bcrypt.compare(dto.contrasena_usuario, usuario.contrasena_usuario);
    if (!ok) throw new UnauthorizedException('CREDENCIALES_INVALIDAS');

    // actualizar ultimo_acceso
    await this.prisma.usuario.update({
=======
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bitacoraService: BitacoraService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, ip?: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { nombre_usuario: dto.nombre_usuario },
      include: {
        rol: {
          include: {
            permisos: {
              include: {
                permiso: true,
              },
            },
          },
        },
      },
    });

    const coincide = await bcrypt.compare(
      dto.contrasena_usuario,
      usuario?.contrasena_usuario ?? HASH_FALSO,
    );

    if (
      !usuario ||
      !coincide ||
      !usuario.estado ||
      !usuario.rol.estado
    ) {
      throw new UnauthorizedException(
        INVALID_CREDENTIALS_EXCEPTION,
      );
    }

    const payload: JwtPayload = {
      sub: usuario.id_usuario,
      usuario: usuario.nombre_usuario,
      rol: usuario.rol.nombre_rol,
      permisos: usuario.rol.permisos.map(
        (rp) => rp.permiso.nombre_permiso,
      ),
    };

    const access_token = await this.jwtService.signAsync(payload);

    await this.prismaService.usuario.update({
>>>>>>> equipo/develop
      where: { id_usuario: usuario.id_usuario },
      data: { ultimo_acceso: new Date() },
    });

<<<<<<< HEAD
    // registrar en bitacora
    await this.bitacoraService.registrar({
      id_usuario: usuario.id_usuario,
      accion: 'LOGIN',
      descripcion: `Inicio de sesión de ${usuario.nombre_usuario}`,
    });

    const payload = { 
      id_usuario: usuario.id_usuario, 
      nombre_usuario: usuario.nombre_usuario,
      id_rol: usuario.id_rol,
      rol: usuario.rol.nombre_rol,
      permisos: usuario.rol.permisos.map(p => p.permiso.nombre_permiso)
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: payload,
=======
    await this.bitacoraService.registrar({
      id_usuario: usuario.id_usuario,
      accion: 'LOGIN',
      tabla_afectada: 'usuario',
      registro_id: String(usuario.id_usuario),
      ip_equipo: ip,
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: Number(
        this.configService.get('JWT_EXPIRES_IN') ?? 3600,
      ),
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol.nombre_rol,
      },
>>>>>>> equipo/develop
    };
  }
}