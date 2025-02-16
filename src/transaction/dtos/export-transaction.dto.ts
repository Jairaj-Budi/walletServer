import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ExportTransactionsDto {
  @ApiProperty({
    description: 'Wallet ID to export transactions for',
    example: '4f053040-c861-45cb-a962-3bf9f7ae7648'
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  walletId: string;

  @ApiProperty({
    description: 'Number of records to skip',
    required: false,
    default: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @ApiProperty({
    description: 'Number of records to return',
    required: false,
    default: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 100;
}