import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

  @ApiProperty({ example: 'Admin12345*' })
  @IsString()
  @IsNotEmpty()
  contrasena_usuario: string;
}