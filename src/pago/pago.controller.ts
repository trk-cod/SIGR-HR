import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PagoService } from './pago.service.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { ListarPagosDto } from './dto/listar-pagos.dto.js';
import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiTags('pago')
@ApiBearerAuth()
@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Get()
  @Permisos('pago:ver')
  listar(@Query() query: ListarPagosDto) {
    return this.pagoService.listarPagos(query);
  }

  @Get(':id')
  @Permisos('pago:ver')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.pagoService.buscarUnPago(id);
  }

  @Post()
  @Permisos('pago:crear')
  crear(@Body() dto: CreatePagoDto) {
    return this.pagoService.crearPago(dto);
  }

  @Patch(':id/anular')
  @Permisos('pago:editar')
  anular(@Param('id', ParseIntPipe) id: number) {
    return this.pagoService.anularPago(id);
  }
}