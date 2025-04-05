import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { DatabaseTransactionsService } from '../database-transactions/database-transactions.service';
import {
  Transaction,
  TransactionSchema,
} from '../transaction/transaction.schema';
import { WalletRepository } from './repositories/wallet.repository';
import { CacheService } from '../common/services/cache.service';
import { TransactionManager } from '../common/services/transaction-manager.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    DatabaseTransactionsService,
    WalletRepository,
    CacheService,
    TransactionManager,
  ],
})
export class WalletModule {}
