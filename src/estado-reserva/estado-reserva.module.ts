import { Module } from '@nestjs/common';

import { EstadoReservaService } from './estado-reserva.service.js';
import { EstadoReservaController } from './estado-reserva.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [EstadoReservaController],
  providers: [EstadoReservaService],
})
export class EstadoReservaModule {}
