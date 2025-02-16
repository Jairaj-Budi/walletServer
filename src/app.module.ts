import { Module } from '@nestjs/common';
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
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Using config file
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),    
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    CacheModule.register({
      isGlobal:true,
      store: redisStore,
      host: 'localhost', // Redis host
      port: 6379,        // Redis port
      ttl: 60,           // Cache expiration time (60 seconds)
    }),
    WalletModule,
    TransactionModule,
  ],
  providers: [AppService,],
  controllers: [  AppController],
})
export class AppModule {}

