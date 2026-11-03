import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateHabitacionDto {
  @ApiProperty({ example: '301' })
  @IsString() @IsNotEmpty() @MaxLength(10)
  numero_habitacion: string;

  @ApiProperty({ example: 3 })
  @Type(() => Number) @IsInt() @Min(1)
  piso: number;

  @ApiProperty({ example: 1, description: 'id del tipo de habitación' })
  @Type(() => Number) @IsInt() @Min(1)
  id_tipo: number;

  @ApiProperty({ example: 1, description: 'id del estado inicial' })
  @Type(() => Number) @IsInt() @Min(1)
  id_est_habitacion: number;

  @ApiPropertyOptional({ example: 'Vista al mar' })
  @IsOptional() @IsString() @MaxLength(200)
  descripcion?: string;
}