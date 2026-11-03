
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

import { HuespedService } from './huesped.service.js';
import { CreateHuespedDto } from './dto/create-huesped.dto.js';
import { UpdateHuespedDto } from './dto/update-huesped.dto.js';
import { ListarHuespedesDto } from './dto/listar-huespedes.dto.js';
import { Permisos } from '../auth/decorators/permisos.decorator.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('huesped')
@Controller('huesped')
export class HuespedController {
  constructor(private readonly huespedService: HuespedService) {}
  @Permisos('huesped:ver')
  @Get()
  listarHuespedes(@Query() query: ListarHuespedesDto) {
    return this.huespedService.listarHuespedes(query);
  }
  @Permisos('huesped:ver')
  @Get(':id')
  buscarUnHuesped(@Param('id', ParseUUIDPipe) id: string) {
    return this.huespedService.buscarUnHuesped(id);
  }
  @Permisos('huesped:crear')
  @Post()
  @ApiBody({ type: CreateHuespedDto })
  crearHuesped(@Body() huesped: CreateHuespedDto) {
    return this.huespedService.crearHuesped(huesped);
  }
  @Permisos('huesped:editar')
  @Patch(':id')
  actualizarHuesped(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() huesped: UpdateHuespedDto,
  ) {
    return this.huespedService.actualizarHuesped(id, huesped);
  }
  @Permisos('huesped:desactivar')
  @Delete(':id')
  desactivarHuesped(@Param('id', ParseUUIDPipe) id: string) {
    return this.huespedService.desactivarHuesped(id);
  }
}
