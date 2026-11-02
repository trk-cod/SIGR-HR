
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
