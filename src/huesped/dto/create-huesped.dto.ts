
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHuespedDto {
  @ApiProperty({ example: 'María Elena' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre_hu: string;

  @ApiProperty({ example: 'Pérez Santana' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido_hu: string;

  @ApiProperty({
    example: '001-1234567-8',
    description: 'Cédula o pasaporte',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  identificacion_hu: string;

  @ApiPropertyOptional({ example: '809-555-0101' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono_hu?: string;

  @ApiPropertyOptional({ example: 'maria@correo.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  correo_hu?: string;

  @ApiPropertyOptional({ example: 'Calle Duarte #12, Barahona' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion_hu?: string;

  @ApiPropertyOptional({ example: 'Dominicana' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nacionalidad_hu?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
