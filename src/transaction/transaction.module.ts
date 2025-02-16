import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transaction.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionPureService } from './services/transaction-pure.service';
import { TransactionSecurityService } from './services/transaction-security.service';
import { TransactionCacheService } from './services/transaction-cache.service';
import { DatabaseTransactionsService } from '../database-transactions/database-transactions.service';
import { CacheService } from 'src/common/services/cache.service';
import { Wallet, WalletSchema } from 'src/wallet/schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Wallet.name, schema: WalletSchema },
    ])
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionPureService,
    DatabaseTransactionsService,
    TransactionSecurityService,
    TransactionCacheService,CacheService
  ],
  exports: [TransactionService]
})
export class TransactionModule {}
