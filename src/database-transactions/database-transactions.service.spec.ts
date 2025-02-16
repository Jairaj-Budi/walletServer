import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTransactionsService } from './database-transactions.service';

describe('DatabaseTransactionsService', () => {
  let service: DatabaseTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseTransactionsService],
    }).compile();

    service = module.get<DatabaseTransactionsService>(DatabaseTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
