import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { HabitacionController } from './habitacion.controller.js';
import { HabitacionService } from './habitacion.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [HabitacionController],
  providers: [HabitacionService],
})
export class HabitacionModule {}