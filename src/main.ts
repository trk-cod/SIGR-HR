<<<<<<< HEAD
=======

>>>>>>> equipo/develop
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { FileLogger } from './common/file-logger.service.js';

async function bootstrap() {
<<<<<<< HEAD
  const app = await NestFactory.create(AppModule, { logger: new FileLogger() });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
=======
  const app = await NestFactory.create(AppModule, {
    logger: new FileLogger(),
  });

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
>>>>>>> equipo/develop

  const config = new DocumentBuilder()
    .setTitle('API SIGR-HR')
    .setDescription('Sistema Integral de Gestión de Reservas Hotel Rea')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
<<<<<<< HEAD
  const documentFactory = () => SwaggerModule.createDocument(app, config);
=======

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config);

>>>>>>> equipo/develop
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
<<<<<<< HEAD
await bootstrap();
=======

await bootstrap();
>>>>>>> equipo/develop
