import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service.js';
import { BitacoraService } from '../bitacora/bitacora.service.js';
import { PrismaService } from '../message/prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
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
      where: { id_usuario: usuario.id_usuario },
      data: { ultimo_acceso: new Date() },
    });

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
    };
  }
}