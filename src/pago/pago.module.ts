import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';import { PagoController } from './pago.controller.js';
import { PagoService } from './pago.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule {}