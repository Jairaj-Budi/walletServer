import { HttpException, HttpStatus } from '@nestjs/common';

export class WalletNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Wallet with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class InsufficientBalanceException extends HttpException {
  constructor() {
    super('Insufficient balance for this transaction', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidTransactionException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
} 