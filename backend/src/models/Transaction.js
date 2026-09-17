import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    staffUser: { type: mongoose.Schema.Types.ObjectId, ref: 'StaffUser', required: true },
    type: { type: String, enum: ['purchase', 'redemption'], required: true },
    amount: { type: Number, required: true, min: 0 },
    points: { type: Number, required: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
