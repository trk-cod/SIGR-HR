<<<<<<< HEAD
=======

>>>>>>> equipo/develop
import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
<<<<<<< HEAD
import { Prisma } from '../generated/prisma/client.js';
import {
  BAD_REQUEST_FK_EXCEPTION,
  CONFLICT_EXCEPTION,
  FK_IN_USE_EXCEPTION,
=======

import { Prisma } from '../generated/prisma/client.js';

import {
  BAD_REQUEST_FK_EXCEPTION,
  CONFLICT_EXCEPTION,
>>>>>>> equipo/develop
  INTERNAL_ERROR_EXCEPTION,
  NOT_FOUND_EXCEPTION,
} from '../message/message.js';

export function handlePrismaError(
  error: unknown,
  logger: Logger,
  contexto: string,
  mensajeConflicto: string = CONFLICT_EXCEPTION,
<<<<<<< HEAD
  mensajeEnUso: string = FK_IN_USE_EXCEPTION,
): never {
  // Errores que ya lanzamos nosotros pasan tal cual
=======
): never {
  // Los errores HTTP que ya lanzamos pasan tal cual.
>>>>>>> equipo/develop
  if (error instanceof HttpException) throw error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException(mensajeConflicto);
<<<<<<< HEAD
      case 'P2025':
        throw new NotFoundException(NOT_FOUND_EXCEPTION);
      case 'P2003':
        throw new BadRequestException(
          mensajeEnUso !== FK_IN_USE_EXCEPTION ? mensajeEnUso : BAD_REQUEST_FK_EXCEPTION,
        );
      case 'P2034':
        throw new ConflictException(
          'La operación chocó con otra en curso. Intenta de nuevo',
        );
    }
  }

=======

      case 'P2025':
        throw new NotFoundException(NOT_FOUND_EXCEPTION);

      case 'P2003':
        throw new BadRequestException(BAD_REQUEST_FK_EXCEPTION);
    }
  }

  // El detalle técnico queda registrado internamente.
>>>>>>> equipo/develop
  logger.error(
    `${contexto}: ${error instanceof Error ? error.message : String(error)}`,
    error instanceof Error ? error.stack : undefined,
  );
<<<<<<< HEAD
  throw new InternalServerErrorException(INTERNAL_ERROR_EXCEPTION);
}
=======

  throw new InternalServerErrorException(INTERNAL_ERROR_EXCEPTION);
}
>>>>>>> equipo/develop
