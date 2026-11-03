import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({ example: 'Auditor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre_rol: string;

  @ApiPropertyOptional({ example: 'Solo consulta' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}