import { Injectable } from '@nestjs/common';
import { Transaction } from '../transaction.schema';
import { ExportTransactionsDto } from '../dtos/export-transaction.dto';

@Injectable()
export class TransactionPureService {
  /**
   * Pure function to format transaction data for CSV
   */
  static formatTransactionForCSV(transaction: Transaction): string {
    const escapedDescription =
      transaction.description?.replace(/"/g, '""') || '';
    return [
      transaction.id,
      transaction.walletId,
      transaction.amount,
      transaction.balance,
      `"${escapedDescription}"`,
      transaction.date.toISOString(),
      transaction.type,
    ].join(',');
  }

  /**
   * Pure function to create CSV header
   */
  static createCSVHeader(): string {
    return 'id,walletId,amount,balance,description,date,type\n';
  }

  /**
   * Pure function to validate transaction batch size
   */
  static validateBatchSize(size: number): number {
    const MIN_BATCH_SIZE = 100;
    const MAX_BATCH_SIZE = 5000;
    return Math.min(Math.max(size, MIN_BATCH_SIZE), MAX_BATCH_SIZE);
  }

  /**
   * Pure function to calculate pagination
   */
  static calculatePagination(dto: ExportTransactionsDto) {
    return {
      skip: dto.skip || 0,
      limit: dto.limit || 100,
    };
  }

  /**
   * Pure function to validate and sanitize wallet ID
   */
  static sanitizeWalletId(walletId: string): string {
    return walletId.trim();
  }
}
