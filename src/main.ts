import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SanitizePipe } from './common/pipes/sanitize.pipe';
import { setupCluster } from './cluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    new SanitizePipe(),
  );
  
  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  const configService = app.get(ConfigService);
  
  // Verify MongoDB URI is available
  const mongoUri = configService.get<string>('MONGODB_URI');
  console.log('Starting application with MongoDB URI:', mongoUri);

  const port = configService.get<number>('port') || 3000;
  
  // Security middleware
  app.enableCors()
  app.use(helmet());
  
  // Enable shutdown hooks
  app.enableShutdownHooks();
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Wallet API')
    .setDescription('API documentation for the Wallet Service')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// Use clustering in production only
if (process.env.NODE_ENV === 'production') {
  setupCluster(bootstrap);
} else {
  bootstrap();
}
