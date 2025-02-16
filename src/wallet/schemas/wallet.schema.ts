import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Using UUID for unique IDs

export type WalletDocument = Wallet & Document;

@Schema({
  timestamps: true, // Automatically adds createdAt & updatedAt fields
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id; // Removing MongoDB `_id`
      delete ret.__v; // Removing version key
      delete ret.createdAt // Removing createdAt
      delete ret.updatedAt // Removing updatedAt
    },
  },
})
export class Wallet {
  @Prop({ required: true, default: uuidv4, unique: true })
  id: string; // Changed to string for better ID management (UUID)

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: () => new Date() })
  date: Date; // Default value ensures no manual assignment needed

  @Prop({ required: true, default: uuidv4, unique: true })
  transactionId: string; // Changed to UUID for better uniqueness
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.index({id:1})
WalletSchema.index({name:1}, {unique : true})