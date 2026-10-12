
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'SIGR-HR API funcionando correctamente';
  }
}

