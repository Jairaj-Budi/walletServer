import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  app.enableCors()
    // Enable Helmet for security headers
    app.use(helmet());

    // Listen for shutdown signals
  app.enableShutdownHooks();

   // Swagger Configuration
   const config = new DocumentBuilder()
   .setTitle('Wallet API') // API Title
   .setDescription('API documentation for the Wallet Service') // Description
   .setVersion('1.0') // API Version
   .addBearerAuth() // Enable Authorization using Bearer Token (JWT)
   .build();

 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
