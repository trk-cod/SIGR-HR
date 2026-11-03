import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export class AsignarPermisosDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs de los permisos que se asignarán al rol',
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  permisoIds: number[];
}