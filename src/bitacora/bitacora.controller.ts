<<<<<<< HEAD
import { Controller } from '@nestjs/common';

@Controller('bitacora')
export class BitacoraController {}
=======
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BitacoraService } from './bitacora.service.js';
import { ListarBitacoraDto } from './dto/listar-bitacora.dto.js';
import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiTags('bitacora')
@ApiBearerAuth()
@Controller('bitacora')
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Get()
  @Permisos('bitacora:ver')
  listarBitacora(@Query() query: ListarBitacoraDto) {
    return this.bitacoraService.listarBitacora(query);
  }
}
>>>>>>> equipo/develop
