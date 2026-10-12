import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { HuespedModule } from './huesped/huesped.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true}), PrismaModule, HuespedModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
