import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class TransactionManager {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async executeInTransaction<T>(
    operation: (session: any) => Promise<T>
  ): Promise<T> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
} 