import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ example: 'John Doe', description: 'Owner of the wallet' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 1000, description: 'Initial balance of the wallet' })
  @IsNumber()
  @Min(0) // Balance cannot be negative
  balance: number;
}
