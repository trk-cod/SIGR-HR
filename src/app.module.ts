
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppService } from './app.service.js';
import { HuespedModule } from './huesped/huesped.module.js';
import { PermisoModule } from './permiso/permiso.module.js';
import { RolModule } from './rol/rol.module.js';
import { UsuarioModule } from './usuario/usuario.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BitacoraModule } from './bitacora/bitacora.module.js';
import { EstadoReservaModule } from './estado-reserva/estado-reserva.module.js';
import { MetodoPagoModule } from './metodo-pago/metodo-pago.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HuespedModule,
    PermisoModule,
    RolModule,
    UsuarioModule,
    AuthModule,
    BitacoraModule,
    EstadoReservaModule,
    MetodoPagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

