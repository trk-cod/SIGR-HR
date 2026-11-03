<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './message/prisma/prisma.module.js';
=======

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppService } from './app.service.js';
>>>>>>> equipo/develop
import { HuespedModule } from './huesped/huesped.module.js';
import { PermisoModule } from './permiso/permiso.module.js';
import { RolModule } from './rol/rol.module.js';
import { UsuarioModule } from './usuario/usuario.module.js';
<<<<<<< HEAD
import { BitacoraModule } from './bitacora/bitacora.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, HuespedModule, PermisoModule, RolModule, UsuarioModule, BitacoraModule, AuthModule, HabitacionModule, CargoModule, EmpleadoModule, PagoModule, FacturaModule],
=======
import { AuthModule } from './auth/auth.module.js';
import { BitacoraModule } from './bitacora/bitacora.module.js';



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
  ],
>>>>>>> equipo/develop
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
<<<<<<< HEAD
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { HabitacionModule } from './habitacion/habitacion.module.js';
import { CargoModule } from './cargo/cargo.module.js';
import { EmpleadoModule } from './empleado/empleado.module.js';
import { PagoModule } from './pago/pago.module.js';
import { FacturaModule } from './factura/factura.module.js';

export class ListarHabitacionesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
=======

>>>>>>> equipo/develop
