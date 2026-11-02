
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HuespedService } from './huesped.service.js';
import { CreateHuespedDto } from './dto/create-huesped.dto.js';
import { UpdateHuespedDto } from './dto/update-huesped.dto.js';
import { publicDecrypt } from 'node:crypto';

@ApiTags('huesped')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('huesped')
export class HuespedController {
  constructor(private readonly huespedService: HuespedService) {}

  @Get()
  listarHuespedes() {
    return this.huespedService.listarHuespedes();
  }

  @Get(':id')
  buscarUnHuesped(@Param('id', ParseIntPipe) id: number) {
    return this.huespedService.buscarUnHuesped(id);
  }

  @Post()
  @ApiBody({ type: CreateHuespedDto })
  crearHuesped(@Body() huesped: CreateHuespedDto) {
    return this.huespedService.crearHuesped(huesped);
  }

  @Put(':id')
  actualizarHuesped(
    @Param('id', ParseIntPipe) id: number,
    @Body() huesped: UpdateHuespedDto,
  ) {
    return this.huespedService.actualizarHuesped(id, huesped);
  }

  @Delete(':id')
  desactivarHuesped(@Param('id', ParseIntPipe) id: number) {
    return this.huespedService.desactivarHuesped(id);
  }
}
