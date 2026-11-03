import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CargoService } from './cargo.service.js';
import { CreateCargoDto } from './dto/create-cargo.dto.js';
import { UpdateCargoDto } from './dto/update-cargo.dto.js';

@ApiTags('cargo')
@Controller('cargo')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Get()
  listarCargos() {
    return this.cargoService.listarCargos();
  }

  @Get(':id')
  buscarUnCargo(@Param('id', ParseIntPipe) id: number) {
    return this.cargoService.buscarUnCargo(id);
  }

  @Post()
  @ApiBody({ type: CreateCargoDto })
  crearCargo(@Body() dto: CreateCargoDto) {
    return this.cargoService.crearCargo(dto);
  }

  @Patch(':id')
  actualizarCargo(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCargoDto) {
    return this.cargoService.actualizarCargo(id, dto);
  }

  @Delete(':id')
  desactivarCargo(@Param('id', ParseIntPipe) id: number) {
    return this.cargoService.desactivarCargo(id);
  }
}