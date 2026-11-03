<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';
=======

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
>>>>>>> equipo/develop
import { HuespedController } from './huesped.controller.js';
import { HuespedService } from './huesped.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [HuespedController],
  providers: [HuespedService],
})
<<<<<<< HEAD
export class HuespedModule {}
=======
export class HuespedModule {}
>>>>>>> equipo/develop
