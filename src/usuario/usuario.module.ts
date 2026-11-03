import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { UsuarioService } from './usuario.service.js';
import { UsuarioController } from './usuario.controller.js';
=======
import { UsuarioService } from './usuario.service.js';
import { UsuarioController } from './usuario.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
>>>>>>> equipo/develop

@Module({
  imports: [PrismaModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
<<<<<<< HEAD
  exports: [UsuarioService],
=======
>>>>>>> equipo/develop
})
export class UsuarioModule {}