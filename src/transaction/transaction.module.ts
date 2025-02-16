import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionSchema } from './transaction.schema';
import { Wallet, WalletSchema } from '../wallet/schemas/wallet.schema';

import { DatabaseTransactionsService } from 'src/database-transactions/database-transactions.service';
// import { DatabaseTransactionsService } from 'src/database-transactions/database-transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Wallet.name, schema: WalletSchema },
    ])
  ],
  controllers: [TransactionController],
  providers: [TransactionService, DatabaseTransactionsService],
})
export class TransactionModule {}
