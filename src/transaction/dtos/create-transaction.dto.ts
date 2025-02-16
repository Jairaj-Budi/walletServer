import { IsString, IsNumber, Min, MaxLength, IsAlphanumeric } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactDto {
  // @ApiProperty({ description: 'The unique identifier for the wallet', example: '12345abcde' })
  // @IsString()
  // walletId: string;

  @ApiProperty({ description: 'Transaction amount', example: 100 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Transaction description', example: 'Payment for order #1234' })
  @IsString()
  @MaxLength(255)
  description: string;
}
