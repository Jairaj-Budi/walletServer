import { Inject, Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { Wallet, WalletDocument } from '../wallet/schemas/wallet.schema';
import { DatabaseTransactionsService } from 'src/database-transactions/database-transactions.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class TransactionService implements OnApplicationShutdown, OnModuleDestroy {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectConnection() private readonly connection: Connection,
        private readonly databaseTransactionService : DatabaseTransactionsService,

        @Inject(CACHE_MANAGER) private cacheManager: Cache
        
    
  ) {}

  async transact(walletId: string, transactionBody) {
    const { amount, description } = transactionBody;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const wallet = await this.databaseTransactionService.findWalletData(walletId, session);
      if (!wallet) {
        throw new Error('Wallet not found.');
      }

      await this.updateWalletBalance(wallet, amount, session);
      const transaction = await this.databaseTransactionService.createTransaction(walletId, amount, wallet.balance, description, session);

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }



   async updateWalletBalance(wallet: WalletDocument, amount: number, session) {
    const cachekey = this.databaseTransactionService.createCacheKey('wallet', wallet);
    const store: any = this.cacheManager.stores;
    if (typeof store.keys === 'function') {
      const keys: string[] = await store.keys('wallet_*'); // Get all keys matching pattern
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => this.cacheManager.del(key))); // Delete matching keys
      }
    }
    wallet.balance += amount;
    await wallet.save({ session });
  }


  async getTransactions(walletId: string, skip: number, limit: number, sortColumn: string, sortOrder: string) {
    try{
    const sortObj  : any= { [sortColumn]: sortOrder === 'true' ? 1 : -1 };
    const data = await this.transactionModel
      .find({ walletId }, { _id: 0, id: 1, walletId: 1, amount: 1, balance: 1, description: 1, date: 1, type: 1 })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalRecords = await this.transactionModel.countDocuments({ walletId });
    return { data, count: totalRecords };
  }catch(error) {
    throw error
  }
  }

  /**
   * Converts an array of transaction objects into CSV format.
   * @param {any[]} data - Transaction data array.
   * @returns {Promise<string>} - CSV formatted string.
   */
   async convertToCsv(data: any[]): Promise<string> {
    if (!data || data.length === 0) {
      return '';
    }

    const header = Object.keys(data[0]).map((key) => JSON.stringify(key)).join(',');
    const rows = data
      .map((item) =>
        Object.values(item)
          .map((value) => (typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value))
          .join(',')
      )
      .join('\n');

    return `${header}\n${rows}`;
  }

  /**
   * Handles application shutdown and cleans up resources.
   */
  async onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down due to: ${signal}`);
    await this.cleanup();
  }

  /**
   * Handles module destruction for cleanup.
   */
  async onModuleDestroy() {
    console.log(`DatabaseTransactionsService module is being destroyed`);
    await this.cleanup();
  }

  /**
   * Cleanup logic for closing database connections.
   */
  private async cleanup() {
    try {
      if (this.connection?.readyState === 1) {
        await this.connection.close();
        console.log(`Database connection closed successfully.`);
      }
    } catch (error) {
      console.log(`Error closing database connection: ${error.message}`, error.stack);
    }
  }
}
