<<<<<<< HEAD
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
=======
import {
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './decorators/public.decorator.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req.ip);
>>>>>>> equipo/develop
  }
}