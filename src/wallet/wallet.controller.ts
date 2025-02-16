import { Controller, Post, Get, Body, Param, HttpCode, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBadRequestResponse } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { Wallet } from './schemas/wallet.schema';
import { CreateWalletDto } from './dtos/create-wallet.dto';
import { LoginDto } from './dtos/login-wallet.dto';

@ApiTags('Wallet') // Grouping API under "Wallet"
@Controller()
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {}

  /**
   * @description Creates a new wallet
   * @param {CreateWalletDto} createWalletBody - Wallet creation payload
   * @returns {Promise<Wallet>} - The created wallet
   */
  @Post('setup')
  @HttpCode(200) // 2010is the standard HTTP status for resource creation
  @ApiOperation({ summary: 'Create a new wallet', description: 'Creates a wallet for the user with an initial balance.' })
  @ApiResponse({ status: 200, description: 'Wallet created successfully', type: Wallet })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiBody({ type: CreateWalletDto }) // Explicitly defining request body structure
  async createWallet(@Body() createWalletBody: CreateWalletDto): Promise<Wallet> {
    this.logger.log(`Creating wallet for user: ${createWalletBody.name}`);
    return this.walletService.createWallet(createWalletBody);
  }


  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User Login', description: 'Authenticate user with username and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async loginUser(@Body() body: LoginDto): Promise<any> {
    return this.walletService.loginUser(body);
  }

  /**
   * @description Retrieves a wallet by ID
   * @param {string} id - Wallet ID
   * @returns {Promise<Wallet>}
   */
  @Get('wallet/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get wallet by ID', description: 'Fetches wallet details using wallet ID.' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully', type: Wallet })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @ApiParam({ name: 'id', required: true, description: 'Unique Wallet ID', example: '65a4f0e87c11e632e4a3caaa' })
  async getWallet(@Param('id') id: string): Promise<Wallet> {
    this.logger.log(`Fetching wallet with ID: ${id}`);
    return this.walletService.getWallet(id);
  }
}
