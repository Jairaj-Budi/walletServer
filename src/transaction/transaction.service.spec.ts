import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../wallet/wallet.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '../wallet/schemas/wallet.schema';

const mockWallet = {
  _id: '123456789',
  name: 'Test Wallet',
  balance: 100.0,
};

class MockWalletModel {
  constructor(private data: any) {}
  save = jest.fn().mockResolvedValue(this.data);
  static findById = jest.fn().mockResolvedValue(mockWallet);
  static create = jest.fn().mockResolvedValue(mockWallet);
}

describe('WalletService', () => {
  let service: WalletService;
  let model: Model<Wallet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: getModelToken(Wallet.name), useValue: MockWalletModel },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    model = module.get<Model<Wallet>>(getModelToken(Wallet.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a wallet', async () => {
    const result = await service.createWallet('Test Wallet', 100);
    expect(result).toEqual(mockWallet);
  });

  it('should get a wallet by ID', async () => {
    const result = await service.getWallet('123456789');
    expect(result).toEqual(mockWallet);
  });
});
