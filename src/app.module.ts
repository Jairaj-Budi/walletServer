import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletSchema } from './wallet/schemas/wallet.schema';
import { TransactionSchema } from './transaction/transaction.schema';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { AppConfigModule } from './config/config.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionManager } from './common/services/transaction-manager.service';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { CompressionMiddleware } from './common/middleware/compression.middleware';
import { HealthController } from './common/controllers/health.controller';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: 300, // 5 minutes default TTL
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error(
            'MONGODB_URI is not defined in environment variables',
          );
        }
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    WalletModule,
    TransactionModule,
  ],
  providers: [AppService, TransactionManager],
  controllers: [AppController, HealthController],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {
    const mongoUri = this.configService.get<string>('MONGODB_URI');
    console.log('MongoDB URI:', mongoUri); // This will help debug the connection string
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware, CompressionMiddleware).forRoutes('*');
  }
}
