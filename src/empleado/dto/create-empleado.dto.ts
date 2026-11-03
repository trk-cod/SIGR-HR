import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString,
  Matches, MaxLength, Min,
} from 'class-validator';

export class CreateEmpleadoDto {
  @ApiProperty({ example: 'Luis' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre_em: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  apellido_em: string;

  @ApiProperty({ example: '001-1234567-8' })
  @Matches(/^[0-9]{3}-?[0-9]{7}-?[0-9]$/)
  cedula_em: string;

  @ApiProperty({ type: String, format: 'date', example: '1995-07-21' })
  @Type(() => Date) @IsDate()
  fecha_nac_emp: Date;

  @ApiPropertyOptional({ description: 'true = femenino, false = masculino' })
  @IsOptional() @IsBoolean()
  sexo?: boolean;

  @ApiPropertyOptional({ example: '809-555-0101' })
  @IsOptional() @IsString() @MaxLength(20)
  telefono_em?: string;

  @ApiPropertyOptional({ example: 'luis@hotelrea.com' })
  @IsOptional() @IsEmail() @MaxLength(100)
  correo_em?: string;

  @ApiPropertyOptional({ example: 'Calle Duarte 12' })
  @IsOptional() @IsString() @MaxLength(100)
  direccion_em?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number) @IsInt() @Min(1)
  id_cargo: number;

  @ApiProperty({ type: String, format: 'date', example: '2023-05-02' })
  @Type(() => Date) @IsDate()
  fecha_ingreso: Date;

  @ApiProperty({ example: 25000 })
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  salario_actual: number;

  @ApiPropertyOptional()
  @IsOptional() @IsBoolean()
  estado?: boolean;
}