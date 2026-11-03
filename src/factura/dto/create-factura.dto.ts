import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateFacturaDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_reserva: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_pago: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_empleado: number;

  @ApiProperty({ example: 'consumidor-final' })
  @IsString()
  @IsIn(['consumidor-final', 'credito-fiscal'])
  tipo_factura: string;

  @ApiPropertyOptional({ example: '131123456' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  rcf?: string;
}