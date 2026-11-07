import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEstadoReservaDto {
  @ApiProperty({ example: 'Pendiente', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nombre_est_res: string;

  @ApiPropertyOptional({ example: 'Reserva pendiente de confirmación', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}
