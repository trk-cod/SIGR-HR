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

@Injectable()
export class AuthService {
  constructor(
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
      where: { id_usuario: usuario.id_usuario },
      data: { ultimo_acceso: new Date() },
    });

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
    };
  }
}