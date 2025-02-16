import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { DatabaseTransactionsService } from 'src/database-transactions/database-transactions.service';
import { Transaction, TransactionSchema } from 'src/transaction/transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema },{name : Transaction.name, schema : TransactionSchema}])],
  controllers: [WalletController],
  providers: [WalletService, DatabaseTransactionsService],
})
export class WalletModule {}
