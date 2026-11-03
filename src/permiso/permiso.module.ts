import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { PermisoController } from './permiso.controller.js';
import { PermisoService } from './permiso.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [PermisoController],
  providers: [PermisoService],
})
export class PermisoModule {}