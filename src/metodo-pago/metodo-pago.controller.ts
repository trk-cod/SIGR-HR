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

import { MetodoPagoService } from './metodo-pago.service.js';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto.js';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto.js';

import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiTags('metodo-pago')
@ApiBearerAuth()
@Controller('metodo-pago')
export class MetodoPagoController {
  constructor(
    private readonly metodoPagoService: MetodoPagoService,
  ) {}

  @Get()
  @Permisos('metodo-pago:ver')
  listarMetodosPago() {
    return this.metodoPagoService.listarMetodosPago();
  }

  @Get(':id')
  @Permisos('metodo-pago:ver')
  buscarUnMetodoPago(@Param('id', ParseIntPipe) id: number) {
    return this.metodoPagoService.buscarUnMetodoPago(id);
  }

  @Post()
  @Permisos('metodo-pago:crear')
  crearMetodoPago(@Body() dto: CreateMetodoPagoDto) {
    return this.metodoPagoService.crearMetodoPago(dto);
  }

  @Patch(':id')
  @Permisos('metodo-pago:editar')
  actualizarMetodoPago(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMetodoPagoDto,
  ) {
    return this.metodoPagoService.actualizarMetodoPago(id, dto);
  }

  @Delete(':id')
  @Permisos('metodo-pago:desactivar')
  eliminarMetodoPago(@Param('id', ParseIntPipe) id: number) {
    return this.metodoPagoService.eliminarMetodoPago(id);
  }
}