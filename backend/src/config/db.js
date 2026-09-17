import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  mongoose.set('sanitizeFilter', true);
  await mongoose.connect(mongoUri);
};
