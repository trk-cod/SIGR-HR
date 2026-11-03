import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCargoDto {
  @ApiProperty({ example: 'Recepcionista' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre_car: string;

  @ApiPropertyOptional({ example: 'Atención al cliente' })
  @IsOptional() @IsString() @MaxLength(200)
  descripcion?: string;

  @ApiProperty({ example: 25000 })
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
  sueldo_base: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean()
  estado?: boolean;
}