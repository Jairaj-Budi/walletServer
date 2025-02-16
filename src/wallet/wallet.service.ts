import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import { DatabaseTransactionsService } from '../database-transactions/database-transactions.service';
import { WalletRepository } from './repositories/wallet.repository';
import { CacheService } from '../common/services/cache.service';
import { TransactionManager } from '../common/services/transaction-manager.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService implements OnApplicationShutdown, OnModuleDestroy{
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly databaseTransactionService : DatabaseTransactionsService,
    private readonly walletRepository: WalletRepository,
    private readonly cacheService: CacheService,
    private readonly transactionManager: TransactionManager
  ) {}

  /**
   * Creates a new wallet.
   * @param createWalletDto DTO containing wallet creation details.
   * @returns The created wallet.
   */
  async createWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const wallet = await this.transactionManager.executeInTransaction(async (session) => {
         // Check if a wallet (user) with the same name already exists
         const existingWallet = await this.walletRepository.findByName(createWalletDto.name);
         if (existingWallet) {
           throw new ConflictException('User already exists');
         }

         const walletData = {
           ...createWalletDto,
           id: uuidv4(),
           transactionId: uuidv4(),
           date: new Date()
         };

         const newWallet = await this.walletRepository.createWithSession(walletData, session);

         // Insert wallet creation transaction record
         await this.databaseTransactionService.createTransaction(
            newWallet.id,
            newWallet.balance,
            newWallet.balance,
            "Wallet creation",
            session
         );

         // Cache the new wallet
         await this.cacheService.set(
           this.cacheService.createKey('wallet', newWallet.id),
           newWallet
         );

         return newWallet;
    });

    return wallet;
  }

  async loginUser(body) {
    const {name} = body;
    const getWalletData = await this.databaseTransactionService.findWalletDataByName(name)
    if(getWalletData?.length) {
      return getWalletData[0];
    }else{
      throw new InternalServerErrorException('Wallet Data not found, please sign up');
    }
  }

  /**
   * Retrieves a wallet by its ID.
   * @param id Wallet ID.
   * @returns The wallet details.
   */
  async getWallet(id: string): Promise<Wallet> {
    const cacheKey = this.cacheService.createKey('wallet', id);
    const cachedWallet = await this.cacheService.get<Wallet>(cacheKey);
    
    if (cachedWallet) {
      return cachedWallet as Wallet;
    }

    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      this.logger.warn(`Wallet not found: ID=${id}`);
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    await this.cacheService.set(cacheKey, wallet);
    this.logger.log(`Wallet retrieved successfully: ID=${id}`);
    if(wallet) {
      wallet.balance = parseFloat(wallet.balance.toFixed(4))
    }
    return wallet;
  }

  /**
   * Handles application shutdown to clean up database connections.
   */
  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`Application is shutting down due to: ${signal}`);
    await this.cleanup();
  }

  async onModuleDestroy() {
    this.logger.warn(`WalletService module is being destroyed`);
    await this.cleanup();
  }

  /**
   * Cleans up database connections.
   */
  private async cleanup() {
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
