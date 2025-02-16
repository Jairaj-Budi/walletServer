import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTransactionsDto {
  @ApiPropertyOptional({ description: 'The unique identifier for the wallet', example: '12345abcde' })
  @IsString()
  @IsOptional()
  walletId?: string;

  @ApiPropertyOptional({ description: 'Number of records to skip', example: 0 })
  @IsString()
  @IsOptional()
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Number of records to fetch', example: 10 })
  @IsString()
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Column to sort by', example: 'amount' })
  @IsString()
  @IsOptional()
  sortColumn?: string = 'amount';

  @ApiPropertyOptional({ description: 'Sort order (asc/desc)', example: 'asc' })
  @IsString()
  @IsOptional()
  sortOrder?: string = 'asc';
}
