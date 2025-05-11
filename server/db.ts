import mongoose from 'mongoose';
import { log } from './vite';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    log('Connecting to MongoDB...', 'mongodb');
    
    // Set connection options with timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    log('MongoDB connected successfully', 'mongodb');
    
    // Set up event listeners
    mongoose.connection.on('error', (err) => {
      log(`MongoDB connection error: ${err}`, 'mongodb');
    });
    
    mongoose.connection.on('disconnected', () => {
      log('MongoDB disconnected', 'mongodb');
    });
    
    mongoose.connection.on('connected', () => {
      log('MongoDB connection established', 'mongodb');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      log('MongoDB connection closed due to app termination', 'mongodb');
      process.exit(0);
    });
    
  } catch (error) {
    log(`MongoDB connection error: ${error}`, 'mongodb');
    // Don't exit process, allow server to continue without MongoDB
    log('Continuing server startup without MongoDB connection', 'mongodb');
  }
};

export default connectDB;