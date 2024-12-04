// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product.routes');

const app = express();

// Connect Database
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');
    
    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/products', productRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server Error:', err.message);
    process.exit(1);
  }
};

startServer();