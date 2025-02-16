import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ExportTransactionsDto {
  @ApiProperty({ description: 'Wallet ID for which transactions need to be exported' })
  @IsString()
  walletId: string;
}