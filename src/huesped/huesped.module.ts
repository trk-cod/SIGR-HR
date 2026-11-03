import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { HuespedController } from './huesped.controller.js';
import { HuespedService } from './huesped.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [HuespedController],
  providers: [HuespedService],
})
export class HuespedModule {}