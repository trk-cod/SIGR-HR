import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FacturaService } from './factura.service.js';
import { CreateFacturaDto } from './dto/create-factura.dto.js';
import { ListarFacturasDto } from './dto/listar-facturas.dto.js';
import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiTags('factura')
@ApiBearerAuth()
@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Get()
  @Permisos('factura:ver')
  listar(@Query() query: ListarFacturasDto) {
    return this.facturaService.listarFacturas(query);
  }

  @Get(':id')
  @Permisos('factura:ver')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.buscarUnaFactura(id);
  }

  @Post()
  @Permisos('factura:crear')
  crear(@Body() dto: CreateFacturaDto) {
    return this.facturaService.crearFactura(dto);
  }

  @Patch(':id/anular')
  @Permisos('factura:editar')
  anular(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.anularFactura(id);
  }
}