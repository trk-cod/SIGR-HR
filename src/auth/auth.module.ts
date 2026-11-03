import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module.js';
import { BitacoraModule } from '../bitacora/bitacora.module.js';

import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { PermisosGuard } from './guards/permisos.guard.js';

@Module({
  imports: [
    PrismaModule,
    BitacoraModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(
            config.get('JWT_EXPIRES_IN') ?? 3600,
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermisosGuard,
    },
  ],
})
export class AuthModule {}