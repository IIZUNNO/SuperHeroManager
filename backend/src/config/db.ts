import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charge les variables d'environnement
dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    console.log('🔧 MONGO_URI:', process.env.MONGO_URI);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;