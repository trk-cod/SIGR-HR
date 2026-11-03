<<<<<<< HEAD
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListarHuespedesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
=======

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class ListarHuespedesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Busca por nombre, apellido o identificación',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
>>>>>>> equipo/develop
