const mongoose = require('mongoose');

// Replace with your MongoDB URI
const MONGO_URI = 'mongodb+srv://gavandheavinash2001:6igtTOdZ2VdRbsiJ@cluster0.mongodb.net/smart-task-manager?retryWrites=true&w=majority';

async function testConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
}

testConnection();