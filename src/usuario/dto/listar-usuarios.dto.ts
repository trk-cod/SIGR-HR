import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class ListarUsuariosDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}