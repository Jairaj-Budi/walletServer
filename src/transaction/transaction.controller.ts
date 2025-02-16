import { Controller, Post, Get, Param, Query, Body, Res, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Response } from 'express';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TransactDto } from './dtos/create-transaction.dto';
import { GetTransactionsDto } from './dtos/get-transaction.dto';
import { ExportTransactionsDto } from './dtos/export-transaction.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

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
   * @description Exports transactions as a CSV file.
   * @param {ExportTransactionsDto} query - Query parameters for export.
   * @param {Response} res - Express response object.
   */
@Get('export')
@HttpCode(200)

@ApiOperation({ summary: 'Export transactions', description: 'Exports transactions as a CSV file.' })
@ApiResponse({ status: 200, description: 'CSV file exported successfully' })
@ApiResponse({ status: 204, description: 'No transactions found to export' })
@ApiResponse({ status: 500, description: 'Internal server error' })
async exportTransactions(@Query() query, @Res() res: Response): Promise<void> {
  try {
    const { data, count } = await this.transactionService.getTransactions(query.walletId, 0, 1000, 'amount', 'true');

    if (!data || data.length === 0) {
      res.status(204).send();
      return;
    }

    const csv = await this.transactionService.convertToCsv(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting transactions:', error);
    throw new HttpException('Error exporting CSV', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}
