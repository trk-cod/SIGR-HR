<<<<<<< HEAD
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermisoService } from './permiso.service.js';
import { Permisos } from '../auth/decorators/permisos.decorator.js';

@ApiTags('permiso')
@ApiBearerAuth()
@Controller('permiso')
export class PermisoController {
  constructor(private readonly permisoService: PermisoService) {}

  @Get()
  @Permisos('permiso:ver')
  listarPermisos() {
    return this.permisoService.listarPermisos();
  }
}
=======
import { Controller } from '@nestjs/common';

@Controller('permiso')
export class PermisoController {}
>>>>>>> equipo/develop
