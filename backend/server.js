require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce Cart API',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      cart: '/api/cart',
      checkout: '/api/checkout',
      orders: '/api/checkout/orders',
      orderById: '/api/checkout/orders/:orderId'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
