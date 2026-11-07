import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReservaDto {
  @ApiProperty({ example: '2026-11-10' })
  @IsDateString()
  fecha_entrada: string;

  @ApiProperty({ example: '2026-11-12' })
  @IsDateString()
  fecha_salida: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad_personas: number;

  @ApiPropertyOptional({ example: 'Reserva para dos personas' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  observaciones?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  id_huesped: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_empleado: number;

  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  habitaciones: number[];
}
