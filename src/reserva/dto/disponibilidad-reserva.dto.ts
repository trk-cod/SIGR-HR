import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DisponibilidadReservaDto {
  @ApiProperty({ example: '2026-11-10' })
  @IsDateString()
  fecha_entrada: string;

  @ApiProperty({ example: '2026-11-12' })
  @IsDateString()
  fecha_salida: string;
}
