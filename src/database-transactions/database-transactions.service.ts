import { Inject, Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateWalletDto } from '../wallet/dtos/create-wallet.dto';
import { Wallet, WalletDocument } from '../wallet/schemas/wallet.schema';
import { Connection, Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../transaction/transaction.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheService } from '../common/services/cache.service';
import { ClientSession } from 'mongoose';

@Injectable()
export class DatabaseTransactionsService implements OnApplicationShutdown, OnModuleDestroy {
    constructor(
        @InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>,
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly cacheService: CacheService
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
        const cacheKey = this.cacheService.createKey('wallet', JSON.stringify(createWalletDto));
        await this.cacheService.set(cacheKey, response);
        return response;
    }

    async findWalletById(id: string): Promise<Wallet | null> {
        const cacheKey = this.cacheService.createKey('wallet', id);
        const cacheData = await this.cacheService.get<Wallet>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const response = await this.walletModel
            .findOne({ id })
            .select('id balance name date -_id')
            .lean()
            .exec();

        await this.cacheService.set(cacheKey, response);
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

    async findWalletData(walletId: string, session: ClientSession): Promise<WalletDocument | null> {
        const cacheKey = this.cacheService.createKey('wallet', walletId);
        const cacheData = await this.cacheService.get<Partial<Wallet>>(cacheKey);
        if (cacheData) {
            return this.walletModel.hydrate(cacheData) as WalletDocument;
        }

        const response = await this.walletModel.findOne({ id: walletId }).session(session);
        if (response) {
            await this.cacheService.set(cacheKey, response.toObject());
        }
        return response;
    }

    async findWalletDataByName(name: string): Promise<Wallet[]> {
        const cacheKey = this.cacheService.createKey('wallet', name);
        const cacheData = await this.cacheService.get<Wallet[]>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const response = await this.walletModel.find({ name }).lean().exec();
        await this.cacheService.set(cacheKey, response);
        return response;
    }

    generateTransactionId() {
        return Math.floor(1000000000 + Math.random() * 9000000000);
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