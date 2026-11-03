import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module.js';
import { BitacoraModule } from '../bitacora/bitacora.module.js';
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [
    PrismaModule,
    UsuarioModule,
    BitacoraModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SigrHrSecret2026',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}