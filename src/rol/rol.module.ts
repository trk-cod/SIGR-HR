import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { RolService } from './rol.service.js';
import { RolController } from './rol.controller.js';
=======
import { RolService } from './rol.service.js';
import { RolController } from './rol.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
>>>>>>> equipo/develop

@Module({
  imports: [PrismaModule],
  controllers: [RolController],
  providers: [RolService],
<<<<<<< HEAD
  exports: [RolService],
=======
>>>>>>> equipo/develop
})
export class RolModule {}