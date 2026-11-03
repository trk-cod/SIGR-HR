<<<<<<< HEAD
import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
=======

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiBody, ApiTags } from '@nestjs/swagger';

>>>>>>> equipo/develop
import { HuespedService } from './huesped.service.js';
import { CreateHuespedDto } from './dto/create-huesped.dto.js';
import { UpdateHuespedDto } from './dto/update-huesped.dto.js';
import { ListarHuespedesDto } from './dto/listar-huespedes.dto.js';
<<<<<<< HEAD

=======
import { Permisos } from '../auth/decorators/permisos.decorator.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
>>>>>>> equipo/develop
@ApiTags('huesped')
@Controller('huesped')
export class HuespedController {
  constructor(private readonly huespedService: HuespedService) {}
<<<<<<< HEAD

=======
  @Permisos('huesped:ver')
>>>>>>> equipo/develop
  @Get()
  listarHuespedes(@Query() query: ListarHuespedesDto) {
    return this.huespedService.listarHuespedes(query);
  }
<<<<<<< HEAD

=======
  @Permisos('huesped:ver')
>>>>>>> equipo/develop
  @Get(':id')
  buscarUnHuesped(@Param('id', ParseUUIDPipe) id: string) {
    return this.huespedService.buscarUnHuesped(id);
  }
<<<<<<< HEAD

=======
  @Permisos('huesped:crear')
>>>>>>> equipo/develop
  @Post()
  @ApiBody({ type: CreateHuespedDto })
  crearHuesped(@Body() huesped: CreateHuespedDto) {
    return this.huespedService.crearHuesped(huesped);
  }
<<<<<<< HEAD

=======
  @Permisos('huesped:editar')
>>>>>>> equipo/develop
  @Patch(':id')
  actualizarHuesped(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() huesped: UpdateHuespedDto,
  ) {
    return this.huespedService.actualizarHuesped(id, huesped);
  }
<<<<<<< HEAD

=======
  @Permisos('huesped:desactivar')
>>>>>>> equipo/develop
  @Delete(':id')
  desactivarHuesped(@Param('id', ParseUUIDPipe) id: string) {
    return this.huespedService.desactivarHuesped(id);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> equipo/develop
