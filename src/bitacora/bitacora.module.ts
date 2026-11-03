import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { BitacoraService } from './bitacora.service.js';

@Module({
  imports: [PrismaModule],
  providers: [BitacoraService],
  exports: [BitacoraService],
})
export class BitacoraModule {}