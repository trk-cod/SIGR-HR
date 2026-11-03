import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HabitacionService } from './habitacion.service.js';
import { CreateHabitacionDto } from './dto/create-habitacion.dto.js';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto.js';
import { ListarHabitacionesDto } from './dto/listar-habitaciones.dto.js';

@ApiTags('habitacion')
@Controller('habitacion')
export class HabitacionController {
  constructor(private readonly habitacionService: HabitacionService) {}

  @Get()
  listarHabitaciones(@Query() query: ListarHabitacionesDto) {
    return this.habitacionService.listarHabitaciones(query);
  }

  @Get(':id')
  buscarUnaHabitacion(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionService.buscarUnaHabitacion(id);
  }

  @Post()
  @ApiBody({ type: CreateHabitacionDto })
  crearHabitacion(@Body() dto: CreateHabitacionDto) {
    return this.habitacionService.crearHabitacion(dto);
  }

  @Patch(':id')
  actualizarHabitacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHabitacionDto,
  ) {
    return this.habitacionService.actualizarHabitacion(id, dto);
  }

  @Delete(':id')
  eliminarHabitacion(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionService.eliminarHabitacion(id);
  }
}