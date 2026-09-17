import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    multiplier: { type: Number, required: true },
    minPoints: { type: Number, required: true },
    maxPoints: { type: Number },
    badgeColor: { type: String, required: true },
  },
  { timestamps: true }
);

export const Tier = mongoose.model('Tier', tierSchema);
