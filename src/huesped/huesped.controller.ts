
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

@ApiTags('huesped')
@Controller('huesped')
export class HuespedController {
  constructor(private readonly huespedService: HuespedService) {}

  @Get()
  listarHuespedes(@Query() query: ListarHuespedesDto) {
    return this.huespedService.listarHuespedes(query);
  }

  @Get(':id')
  buscarUnHuesped(@Param('id', ParseUUIDPipe) id: string) {
    return this.huespedService.buscarUnHuesped(id);
  }

  @Post()
  @ApiBody({ type: CreateHuespedDto })
  crearHuesped(@Body() huesped: CreateHuespedDto) {
    return this.huespedService.crearHuesped(huesped);
  }

  @Patch(':id')
  actualizarHuesped(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() huesped: UpdateHuespedDto,
  ) {
    return this.huespedService.actualizarHuesped(id, huesped);
  }

  @Delete(':id')
  desactivarHuesped(@Param('id', ParseUUIDPipe) id: string) {
    return this.huespedService.desactivarHuesped(id);
  }
}
