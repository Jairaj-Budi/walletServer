import { Inject, Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateWalletDto } from 'src/wallet/dtos/create-wallet.dto';
import { Wallet, WalletDocument } from 'src/wallet/schemas/wallet.schema';
import { Connection, Model } from 'mongoose';
import { Transaction, TransactionDocument } from 'src/transaction/transaction.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class DatabaseTransactionsService implements OnApplicationShutdown, OnModuleDestroy {
    constructor(
        @InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>,
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    // Business Logic Layer
    async insertWallet(createWalletDto: CreateWalletDto, session?: any): Promise<Wallet> {
        const transactionId = this.generateTransactionId();
        const newWallet = new this.walletModel({
            id: transactionId,
            ...createWalletDto,
            transactionId,
            date: new Date(),
        });

        const response = await newWallet.save({ session });
        await this.setCache('wallet', createWalletDto, response);

        return response;
    }

    async findWalletById(id: string): Promise<Wallet | null> {
        const cacheData = await this.getCache('wallet', id);
        if (cacheData) {
            return cacheData;
        }

        const response = await this.walletModel
            .findOne({ id })
            .select('id balance name date -_id')
            .lean()
            .exec();

        await this.setCache('wallet', id, response);
        return response;
    }

    async createTransaction(walletId: string, amount: number, balance: number, description: string, session) {
        const transaction = new this.transactionModel({
            walletId,
            amount: Math.abs(amount),
            balance,
            description,
            type: amount > 0 ? 'CREDIT' : 'DEBIT',
            transactionId: this.generateTransactionId(),
            id: this.generateTransactionId(),
            date: new Date(),
        });
        return transaction.save({ session });
    }

    async findWalletData(walletId: string, session) {
        const cacheData = await this.getCache('wallet', walletId);
        if (cacheData) {
            return cacheData;
        }
        const response = await this.walletModel.findOne({ id: walletId }).session(session);
        console.log('cached:  ', response)
        await this.setCache('wallet', walletId, response);
        return response;
    }

    async findWalletDataByName(name: string) {
        const cacheData = await this.getCache('wallet', name);
        if (cacheData) {
            return cacheData;
        }

        const response = await this.walletModel.find({ name });
        await this.setCache('wallet', name, response);
        return response;
    }

    generateTransactionId() {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    }

    // Redis Caching Layer
    private async getCache(module: string, payload: any): Promise<any> {
        const cacheKey = this.createCacheKey(module, payload);
        return await this.cacheManager.get(cacheKey);
    }

    private async setCache(module: string, payload: any, data: any): Promise<void> {
        try {
            const cacheKey = this.createCacheKey(module, payload);
            await this.cacheManager.set(cacheKey, data);
        } catch (error) {
            console.log(`Error setting cache: ${error.message}`, error.stack);
        }
    }

    private createCacheKey(module: string, payload: any): string {
        return `${module}_${payload}`;
    }

    // Cleanup and Shutdown Logic
    async onApplicationShutdown(signal?: string) {
        console.log(`Application is shutting down due to: ${signal}`);
        await this.cleanup();
    }

    async onModuleDestroy() {
        console.log(`DatabaseTransactionsService module is being destroyed`);
        await this.cleanup();
    }

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