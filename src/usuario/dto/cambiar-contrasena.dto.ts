import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CambiarContrasenaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contrasena_actual: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
  contrasena_nueva: string;
}