import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginacionDto } from '../../common/paginacion.js';

export class ListarEmpleadosDto extends PaginacionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}