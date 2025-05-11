import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Simple test to check MongoDB connection
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connection successful!');
    
    // Define a simple schema
    const TestSchema = new mongoose.Schema({
      name: String,
      date: String
    });
    
    // Create a model
    const Test = mongoose.model('Test', TestSchema);
    
    // Create a test document
    console.log('Creating test document...');
    const testDoc = new Test({
      name: 'Test Document',
      date: new Date().toISOString()
    });
    
    // Save the document
    await testDoc.save();
    console.log('Test document created successfully!');
    
    // Retrieve the document
    const retrievedDoc = await Test.findOne({ name: 'Test Document' });
    console.log('Retrieved document:', retrievedDoc);
    
    // Disconnect
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('MongoDB test failed:', error);
  }
}

testConnection();