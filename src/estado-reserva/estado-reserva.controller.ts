import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { EstadoReservaService } from './estado-reserva.service.js';
import { CreateEstadoReservaDto } from './dto/create-estado-reserva.dto.js';
import { UpdateEstadoReservaDto } from './dto/update-estado-reserva.dto.js';

import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiTags('estado-reserva')
@ApiBearerAuth()
@Controller('estado-reserva')
export class EstadoReservaController {
  constructor(
    private readonly estadoReservaService: EstadoReservaService,
  ) {}

  @Get()
  @Permisos('estado-reserva:ver')
  listarEstadosReserva() {
    return this.estadoReservaService.listarEstadosReserva();
  }

  @Get(':id')
  @Permisos('estado-reserva:ver')
  buscarUnEstadoReserva(@Param('id', ParseIntPipe) id: number) {
    return this.estadoReservaService.buscarUnEstadoReserva(id);
  }

  @Post()
  @Permisos('estado-reserva:crear')
  crearEstadoReserva(@Body() dto: CreateEstadoReservaDto) {
    return this.estadoReservaService.crearEstadoReserva(dto);
  }

  @Patch(':id')
  @Permisos('estado-reserva:editar')
  actualizarEstadoReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoReservaDto,
  ) {
    return this.estadoReservaService.actualizarEstadoReserva(id, dto);
  }

  @Delete(':id')
  @Permisos('estado-reserva:desactivar')
  eliminarEstadoReserva(@Param('id', ParseIntPipe) id: number) {
    return this.estadoReservaService.eliminarEstadoReserva(id);
  }
}
