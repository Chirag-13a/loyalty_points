import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export const Member = mongoose.model('Member', memberSchema);
