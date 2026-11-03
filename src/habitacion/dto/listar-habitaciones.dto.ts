
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginacionDto } from '../../common/paginacion.js';
export class ListarHabitacionesDto extends PaginacionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_tipo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estado?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_est_habitacion?: number;
}