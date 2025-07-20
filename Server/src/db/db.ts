import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL;
    if (!mongoUri) {
      throw new Error('MONGO_URL is not defined in .env');
    }

    await mongoose.connect(mongoUri, {
      dbName: 'realtime-docs',
    });

    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
