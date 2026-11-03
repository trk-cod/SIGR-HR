import { Module } from '@nestjs/common';
import { RolService } from './rol.service.js';
import { RolController } from './rol.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [RolController],
  providers: [RolService],
})
export class RolModule {}