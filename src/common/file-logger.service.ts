
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

@Injectable()
export class FileLogger extends ConsoleLogger {
  private readonly carpeta = join(process.cwd(), 'logs');

  error(message: unknown, ...optionalParams: unknown[]) {
    super.error(message, ...optionalParams);
    void this.escribir('ERROR', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    super.warn(message, ...optionalParams);
    void this.escribir('WARN', message, optionalParams);
  }

  private async escribir(
    nivel: string,
    message: unknown,
    params: unknown[],
  ) {
    try {
      const ahora = new Date();
      const dia = ahora.toISOString().slice(0, 10);
      const detalle = params.map((p) => String(p)).join(' ');

      const linea = `${ahora.toISOString()} [${nivel}] ${String(message)}\n${detalle}\n`;

      await mkdir(this.carpeta, { recursive: true });

      await appendFile(
        join(this.carpeta, `app-${dia}.log`),
        linea,
      );
    } catch {
      // El registro de logs nunca debe tumbar la aplicación.
    }
  }
}
