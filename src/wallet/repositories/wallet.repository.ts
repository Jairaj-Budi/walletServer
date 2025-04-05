import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from '../schemas/wallet.schema';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async create(data: Partial<Wallet>): Promise<Wallet> {
    const wallet = new this.walletModel(data);
    return wallet.save();
  }
  async createWithSession(data: Partial<Wallet>, session): Promise<Wallet> {
    const wallet = new this.walletModel(data);
    return wallet.save({ session });
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.walletModel.findOne({ id }).lean();
  }

  async findByName(name: string): Promise<Wallet | null> {
    return this.walletModel.findOne({ name }).lean();
  }

  async updateBalance(
    id: string,
    balance: number,
    session?: any,
  ): Promise<Wallet | null> {
    return this.walletModel.findOneAndUpdate(
      { id },
      { $set: { balance } },
      { new: true, session },
    );
  }
}
