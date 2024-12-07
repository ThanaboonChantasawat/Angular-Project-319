// backend/config/db.config.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });
    
    // Test connection
    await conn.connection.db.admin().ping();
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Add connection error handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check your connection string and network.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;