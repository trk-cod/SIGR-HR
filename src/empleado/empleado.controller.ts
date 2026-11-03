import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmpleadoService } from './empleado.service.js';
import { CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto.js';
import { ListarEmpleadosDto } from './dto/listar-empleados.dto.js';

@ApiTags('empleado')
@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Get()
  listarEmpleados(@Query() query: ListarEmpleadosDto) {
    return this.empleadoService.listarEmpleados(query);
  }

  @Get(':id')
  buscarUnEmpleado(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.buscarUnEmpleado(id);
  }

  @Post()
  @ApiBody({ type: CreateEmpleadoDto })
  crearEmpleado(@Body() dto: CreateEmpleadoDto) {
    return this.empleadoService.crearEmpleado(dto);
  }

  @Patch(':id')
  actualizarEmpleado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmpleadoDto) {
    return this.empleadoService.actualizarEmpleado(id, dto);
  }

  @Delete(':id')
  desactivarEmpleado(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.desactivarEmpleado(id);
  }
}