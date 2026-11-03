import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { BitacoraService } from './bitacora.service.js';

@Module({
  imports: [PrismaModule],
  providers: [BitacoraService],
=======
import { APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from '../prisma/prisma.module.js';
import { BitacoraService } from './bitacora.service.js';
import { BitacoraController } from './bitacora.controller.js';
import { BitacoraInterceptor } from './bitacora.interceptor.js';

@Module({
  imports: [PrismaModule],
  controllers: [BitacoraController],
  providers: [
    BitacoraService,
    {
      provide: APP_INTERCEPTOR,
      useClass: BitacoraInterceptor,
    },
  ],
>>>>>>> equipo/develop
  exports: [BitacoraService],
})
export class BitacoraModule {}