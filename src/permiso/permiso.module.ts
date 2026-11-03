import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { PermisoController } from './permiso.controller.js';
import { PermisoService } from './permiso.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [PermisoController],
  providers: [PermisoService],
})
export class PermisoModule {}
=======
import { PermisoService } from './permiso.service.js';
import { PermisoController } from './permiso.controller.js';

@Module({
  providers: [PermisoService],
  controllers: [PermisoController]
})
export class PermisoModule {}
>>>>>>> equipo/develop
