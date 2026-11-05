import { Module } from '@nestjs/common';

import { MetodoPagoService } from './metodo-pago.service.js';
import { MetodoPagoController } from './metodo-pago.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MetodoPagoController],
  providers: [MetodoPagoService],
})
export class MetodoPagoModule {}