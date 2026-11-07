import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ReservaController } from './reserva.controller.js';
import { ReservaService } from './reserva.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
