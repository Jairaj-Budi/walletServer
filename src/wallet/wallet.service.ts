import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import { DatabaseTransactionsService } from 'src/database-transactions/database-transactions.service';

@Injectable()
export class WalletService implements OnApplicationShutdown, OnModuleDestroy{
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly databaseTransactionService : DatabaseTransactionsService
  ) {}

  /**
   * Creates a new wallet.
   * @param createWalletDto DTO containing wallet creation details.
   * @returns The created wallet.
   */
  async createWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const getWalletData = await this.databaseTransactionService.findWalletDataByName(createWalletDto.name)
      if(getWalletData?.length) {
        throw new ConflictException(`Wallet with name '${createWalletDto.name}' already exists.`);
      }
      const wallet = await this.databaseTransactionService.insertWallet(createWalletDto, session);
      await session.commitTransaction();
      this.logger.log(`Wallet created successfully: ID=${wallet.id}`);
      return wallet;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(`Wallet creation failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(error);
    } finally {
      await session.endSession();
    }
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


    try {
      const wallet = await this.databaseTransactionService.findWalletById(id);

      if (!wallet) {
        this.logger.warn(`Wallet not found: ID=${id}`);
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }

      this.logger.log(`Wallet retrieved successfully: ID=${id}`);
      return wallet;
    } catch (error) {
      this.logger.error(`Failed to fetch wallet: ID=${id}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve wallet');
    }
  }
    /**
   * Handles application shutdown to clean up database connections.
   */
    async onApplicationShutdown(signal?: string) {
      this.logger.warn(`⚠ Application is shutting down due to: ${signal}`);
      await this.cleanup();
    }

    
  async onModuleDestroy() {
    this.logger.warn(`⚠ WalletService module is being destroyed`);
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
