import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({
  toJSON : {
    transform : (doc,ret)=>{
      delete ret.walletId,
      delete ret.amount,
      delete ret.description,
      delete ret.type,
      delete ret._id,
      delete ret.date,
      delete ret.__v,
      delete ret.id
    }
  }
})
export class Transaction {
  @Prop({ required: true })
  walletId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ required: true, enum: ['CREDIT', 'DEBIT'] })
  type: string;

  @Prop({required : true})
  transactionId : number;

  @Prop({required : true})
  id : number;

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({walletId:1})