import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';import { FacturaController } from './factura.controller.js';
import { FacturaService } from './factura.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [FacturaController],
  providers: [FacturaService],
})
export class FacturaModule {}