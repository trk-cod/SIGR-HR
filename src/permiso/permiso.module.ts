import { Module } from '@nestjs/common';
import { PermisoService } from './permiso.service.js';
import { PermisoController } from './permiso.controller.js';

@Module({
  providers: [PermisoService],
  controllers: [PermisoController]
})
export class PermisoModule {}
