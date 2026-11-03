import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { CambiarContrasenaDto } from './dto/cambiar-contrasena.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';

import { Permisos } from '../auth/decorators/permisos.decorator.js';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator.js';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface.js';

@ApiTags('usuario')
@ApiBearerAuth()
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @Permisos('usuario:ver')
  listarUsuarios(@Query() query: ListarUsuariosDto) {
    return this.usuarioService.listarUsuarios(query);
  }

  @Get(':id')
  @Permisos('usuario:ver')
  buscarUnUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.buscarUnUsuario(id);
  }

  @Post()
  @Permisos('usuario:crear')
  crearUsuario(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.crearUsuario(dto);
  }

  @Patch(':id')
  @Permisos('usuario:editar')
  actualizarUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.actualizarUsuario(id, dto);
  }

  @Patch(':id/contrasena')
  @Permisos('usuario:editar')
  cambiarContrasena(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarContrasenaDto,
  ) {
    return this.usuarioService.cambiarContrasena(id, dto);
  }

  @Delete(':id')
  @Permisos('usuario:desactivar')
  desactivarUsuario(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuarioActual: JwtPayload,
  ) {
    return this.usuarioService.desactivarUsuario(id, usuarioActual.sub);
  }
}