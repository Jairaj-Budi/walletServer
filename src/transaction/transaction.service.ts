import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ClientSession } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { Wallet, WalletDocument } from '../wallet/schemas/wallet.schema';
import { DatabaseTransactionsService } from '../database-transactions/database-transactions.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheService } from '../common/services/cache.service';
import { Response } from 'express';
import { TransactionPureService } from './services/transaction-pure.service';
import { TransactionSecurityService } from './services/transaction-security.service';
import { TransactionCacheService } from './services/transaction-cache.service';
import { ExportTransactionsDto } from './dtos/export-transaction.dto';

@Injectable()
export class TransactionService implements OnApplicationShutdown, OnModuleDestroy {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly databaseTransactionService: DatabaseTransactionsService,
    private readonly cacheService: CacheService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly securityService: TransactionSecurityService,
    private readonly transactionCacheService: TransactionCacheService
  ) {}

  async transact(walletId: string, transactionBody: any): Promise<TransactionDocument> {
    const { amount, description } = transactionBody;
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    try {
      const wallet = await this.databaseTransactionService.findWalletData(walletId, session);
      if (!wallet) {
        throw new Error('Wallet not found.');
      }
      
      await this.updateWalletBalance(wallet, amount, session);
      
      const transaction = await this.databaseTransactionService.createTransaction(
        walletId,
        amount,
        wallet.balance,
        description,
        session,
      );

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      this.logger.error('Transaction error', error.stack);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateWalletBalance(
    wallet: WalletDocument,
    amount: number,
    session: ClientSession
  ): Promise<void> {
    // Clear cache keys related to wallets
    await this.cacheService.clearPattern('wallet_*');

    // Update the wallet balance and save within the provided session context
    wallet.balance += amount;
    await wallet.save({ session });
  }

  async getTransactions(
    walletId: string,
    skip: number,
    limit: number,
    sortColumn: string,
    sortOrder: string
  ): Promise<{ data: any[]; count: number }> {
    const sortObj: Record<string, any> = { [sortColumn]: sortOrder === 'true' ? 1 : -1 };

    const [data, totalRecords] = await Promise.all([
      this.transactionModel
        .find(
          { walletId },
          { _id: 0, id: 1, walletId: 1, amount: 1, balance: 1, description: 1, date: 1, type: 1 }
        )
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.transactionModel.countDocuments({ walletId }),
    ]);

    return { data, count: totalRecords };
  }

  async getTransactionsCount(walletId: string): Promise<number> {
    const cachedCount = await this.transactionCacheService.getCachedCount(walletId);
    if (cachedCount !== null) {
      return cachedCount;
    }

    const count = Number(await this.transactionModel.countDocuments({ walletId }));
    await this.transactionCacheService.setCachedCount(walletId, count);
    return count;
  }

  async streamTransactionsToCSV(walletId: string, res: Response): Promise<void> {
    const batchSize = 1000; // Process in chunks to manage memory
    let skip = 0;
    
    while (true) {
      const transactions = await this.transactionModel
        .find({ walletId })
        .skip(skip)
        .limit(batchSize)
        .sort({ date: 1 })
        .lean()
        .exec();

      if (transactions.length === 0) {
        break;
      }

      for (const transaction of transactions) {
        const line = `${transaction.id},${transaction.walletId},${transaction.amount},${transaction.balance},${transaction.description},${transaction.date},${transaction.type}\n`;
        res.write(line);
      }

      skip += batchSize;
    }
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`Application is shutting down due to: ${signal}`);
    await this.cleanup();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log(`Module is being destroyed`);
    await this.cleanup();
  }

  private async cleanup(): Promise<void> {
    try {
      if (this.connection?.readyState === 1) {
        await this.connection.close();
        this.logger.log(`Database connection closed successfully.`);
      }
    } catch (error) {
      this.logger.error(`Error closing database connection: ${error.message}`, error.stack);
    }
  }
}
