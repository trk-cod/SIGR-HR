<<<<<<< HEAD
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
=======
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
>>>>>>> equipo/develop
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

<<<<<<< HEAD
=======
  @ApiProperty({ example: 'Admin12345*' })
>>>>>>> equipo/develop
  @IsString()
  @IsNotEmpty()
  contrasena_usuario: string;
}