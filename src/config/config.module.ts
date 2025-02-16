import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import appConfig from './app.config';
import { validateEnv } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available across all modules
      load: [databaseConfig, appConfig], // Load separate config files
      validationSchema: validateEnv(), // Validate .env variables
    }),
  ],
})
export class AppConfigModule {}
