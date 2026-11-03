
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolService } from './rol.service.js';

import { CreateRolDto } from './dto/create-rol.dto.js';
import { UpdateRolDto } from './dto/update-rol.dto.js';
import { AsignarPermisosDto } from './dto/asignar-permisos.dto.js';

import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiTags('rol')
@ApiBearerAuth()
@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  @Permisos('rol:ver')
  listarRoles() {
    return this.rolService.listarRoles();
  }

  @Get(':id')
  @Permisos('rol:ver')
  buscarUnRol(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.buscarUnRol(id);
  }

  @Post()
  @Permisos('rol:crear')
  crearRol(@Body() dto: CreateRolDto) {
    return this.rolService.crearRol(dto);
  }

  @Patch(':id')
  @Permisos('rol:editar')
  actualizarRol(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRolDto,
  ) {
    return this.rolService.actualizarRol(id, dto);
  }

  @Delete(':id')
  @Permisos('rol:desactivar')
  desactivarRol(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.desactivarRol(id);
  }

  @Put(':id/permisos')
  @Permisos('rol:editar')
  asignarPermisos(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarPermisosDto,
  ) {
    return this.rolService.asignarPermisos(id, dto);
  }
}
