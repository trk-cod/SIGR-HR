import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMetodoPagoDto {
  @ApiProperty({
    example: 'Tarjeta de Crédito',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_metodo: string;

  @ApiPropertyOptional({
    example: 'Pago realizado mediante tarjeta de crédito',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}