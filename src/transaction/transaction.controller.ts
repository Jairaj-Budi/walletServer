import { Controller, Post, Get, Param, Query, Body, Res, HttpCode, HttpException, HttpStatus, ValidationPipe, Logger } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Response } from 'express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactDto } from './dtos/create-transaction.dto';
import { GetTransactionsDto } from './dtos/get-transaction.dto';
import { ExportTransactionsDto } from './dtos/export-transaction.dto';

@Controller()
@ApiTags('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {
    this.logger.log('TransactionController initialized');
  }

  /**
   * @description Processes a transaction for a given wallet ID and updates the balance accordingly.
   * @param {string} walletId - The unique identifier for the wallet.
   * @param {TransactDto} transactDto - The transaction details including amount and description.
   * @returns {Promise<{ success: boolean; message: string; data?: any }>} - The transaction result.
   */
  @Post('transact/:walletId')
  @ApiOperation({ summary: 'Create a transaction', description: 'Processes a transaction for a given wallet ID and updates the balance accordingly.' })
  @ApiResponse({ status: 200, description: 'Transaction successful' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'walletId', required: true, description: 'The unique identifier for the wallet.' })
  @HttpCode(200)
  async transact(
    @Param('walletId') walletId: string,
    @Body() transactionBody: TransactDto,
  ) {
    try {
      return await this.transactionService.transact(walletId, transactionBody);
    } catch (error) {
      console.error('Transaction error:', error);
      throw new HttpException({ success: false, message: 'Transaction failed', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description Retrieves a list of transactions based on the provided query parameters.
   * @param {GetTransactionsDto} query - Query parameters for filtering and pagination.
   * @returns {Promise<any>} - A list of transactions.
   */
  @Get('transactions')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get transactions list', description: 'Retrieves a list of transactions based on the provided query parameters.' })
  @ApiResponse({ status: 200, description: 'List of transactions retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'walletId', required: true, description: 'The unique identifier for the wallet' })
  @ApiQuery({ name: 'skip', required: true, description: 'Number of records to skip', example: 0 })
  @ApiQuery({ name: 'limit', required: true, description: 'Number of records to fetch', example: 10 })
  @ApiQuery({ name: 'sortColumn', required: true, description: 'Column to sort by', example: 'amount' })
  @ApiQuery({ name: 'sortOrder', required: true, description: 'Sort order (asc/desc)', example: 'asc' })
  async getTransactions(@Query() query: GetTransactionsDto) {
    try {
      return  await this.transactionService.getTransactions(
        query.walletId ?? '',
        query.skip ?? 0,
        query.limit ?? 10,
        query.sortColumn ?? 'amount',
        query.sortOrder ?? 'asc',
      );
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      throw new HttpException({ success: false, message: 'Failed to retrieve transactions', error: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description Exports transactions as a CSV file with streaming support.
   * @param {ExportTransactionsDto} query - Query parameters for export.
   * @param {Response} res - Express response object.
   */
  @Get('export')
  @HttpCode(200)
  @ApiOperation({ summary: 'Export transactions' })
  @ApiResponse({ status: 200, description: 'CSV file exported successfully' })
  @ApiResponse({ status: 204, description: 'No transactions found to export' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'walletId', required: true, description: 'The unique identifier for the wallet' })
  async exportTransactions(
    @Query(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      transformOptions: { enableImplicitConversion: true }
    })) query: ExportTransactionsDto, 
    @Res() res: Response
  ): Promise<void> {
    this.logger.log(`Export request received for wallet: ${query.walletId}`);
    
    try {
      const totalCount = await this.transactionService.getTransactionsCount(query.walletId);
      this.logger.log(`Found ${totalCount} transactions to export`);

      if (totalCount === 0) {
        res.status(204).end();
        return;
      }

      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transactions-${query.walletId}.csv`);

      // Stream the CSV header
      const header = 'walletId,amount,balance,description,date,type\n';
      res.write(header);

      // Stream data in chunks
      await this.transactionService.streamTransactionsToCSV(query.walletId, res);
      
      this.logger.log('Export completed successfully');
      res.end();
    } catch (error) {
      // If headers haven't been sent yet, we can throw an error
      // Otherwise, we need to end the response stream
      if (!res.headersSent) {
        this.logger.error(`Export failed: ${error.message}`, error.stack);
        throw new HttpException(
          { 
            success: false, 
            message: 'Failed to export transactions', 
            error: error.message 
          }, 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        // If we've already started streaming, end the response with an error indicator
        this.logger.error(`Export failed after streaming started: ${error.message}`, error.stack);
        res.end();
      }
    }
  }
}
