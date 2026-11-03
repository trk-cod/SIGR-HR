<<<<<<< HEAD
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

  @IsString()
  @IsNotEmpty()
  contrasena_usuario: string;

  @IsNumber()
=======
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'recepcion02' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  nombre_usuario: string;

  @ApiProperty({ example: 'Clave*2026' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'La contraseña debe tener mayúsculas, minúsculas y números',
  })
  contrasena_usuario: string;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
>>>>>>> equipo/develop
  id_rol: number;
}