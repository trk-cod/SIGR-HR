import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateReservaDto {
  @ApiPropertyOptional({ example: 3, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad_personas?: number;

  @ApiPropertyOptional({ example: 'Se agrega una persona a la reserva' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  observaciones?: string;
}
