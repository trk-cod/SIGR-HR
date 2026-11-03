import { Module } from '@nestjs/common';
import { PrismaModule } from '../message/prisma/prisma.module.js';
import { RolService } from './rol.service.js';
import { RolController } from './rol.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [RolController],
  providers: [RolService],
  exports: [RolService],
})
export class RolModule {}