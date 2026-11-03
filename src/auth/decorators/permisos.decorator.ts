import { SetMetadata } from '@nestjs/common';
import type { Permiso } from '../../common/permisos.js';

export const PERMISOS_KEY = 'permisos';

export const Permisos = (...permisos: Permiso[]) =>
  SetMetadata(PERMISOS_KEY, permisos);