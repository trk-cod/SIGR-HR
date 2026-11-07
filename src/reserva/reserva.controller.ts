import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { ReservaService } from './reserva.service.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { ListarReservasDto } from './dto/listar-reservas.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { DisponibilidadReservaDto } from './dto/disponibilidad-reserva.dto.js';
import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiBearerAuth()
@ApiTags('reserva')
@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Permisos('reserva:ver')
  @Get()
  listarReservas(@Query() query: ListarReservasDto) {
    return this.reservaService.listarReservas(query);
  }

  @Permisos('habitacion:ver')
  @Get('disponibilidad')
  consultarDisponibilidad(@Query() query: DisponibilidadReservaDto) {
    return this.reservaService.consultarDisponibilidad(query);
  }

  @Permisos('reserva:ver')
  @Get(':id')
  buscarUnaReserva(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.buscarUnaReserva(id);
  }

  @Permisos('reserva:crear')
  @Post()
  @ApiBody({ type: CreateReservaDto })
  crearReserva(@Body() reserva: CreateReservaDto) {
    return this.reservaService.crearReserva(reserva);
  }

  @Permisos('reserva:editar')
  @Patch(':id')
  actualizarReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body() reserva: UpdateReservaDto,
  ) {
    return this.reservaService.actualizarReserva(id, reserva);
  }

  @Permisos('reserva:editar')
  @Patch(':id/confirmar')
  confirmarReserva(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.confirmarReserva(id);
  }

  @Permisos('reserva:editar')
  @Patch(':id/cancelar')
  cancelarReserva(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.cancelarReserva(id);
  }
}
