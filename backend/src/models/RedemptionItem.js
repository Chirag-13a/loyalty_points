import mongoose from 'mongoose';

const redemptionItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    pointsCost: { type: Number, required: true, min: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RedemptionItem = mongoose.model('RedemptionItem', redemptionItemSchema);
