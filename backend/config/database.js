const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-cart');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Initialize mock data if database is empty
    await initializeMockData();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Make sure MongoDB is installed and running!');
    process.exit(1);
  }
};

const initializeMockData = async () => {
  const Product = require('../models/Product');
  
  try {
    const count = await Product.countDocuments();
    
    if (count === 0) {
      const products = [
        {
          name: 'Classic White T-Shirt',
          price: 499,
          description: 'Comfortable cotton t-shirt perfect for everyday wear',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          category: 'Clothing'
        },
        {
          name: 'Denim Jeans',
          price: 1299,
          description: 'Premium quality denim jeans with modern fit',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
          category: 'Clothing'
        },
        {
          name: 'Leather Wallet',
          price: 799,
          description: 'Genuine leather wallet with multiple card slots',
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
          category: 'Accessories'
        },
        {
          name: 'Wireless Headphones',
          price: 2499,
          description: 'High-quality wireless headphones with noise cancellation',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          category: 'Electronics'
        },
        {
          name: 'Smart Watch',
          price: 3999,
          description: 'Feature-rich smartwatch with fitness tracking',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          category: 'Electronics'
        },
        {
          name: 'Running Shoes',
          price: 1899,
          description: 'Comfortable running shoes with excellent cushioning',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          category: 'Footwear'
        },
        {
          name: 'Backpack',
          price: 1199,
          description: 'Spacious backpack with laptop compartment',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
          category: 'Accessories'
        },
        {
          name: 'Sunglasses',
          price: 899,
          description: 'Stylish sunglasses with UV protection',
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
          category: 'Accessories'
        },
        {
          name: 'Coffee Mug',
          price: 299,
          description: 'Ceramic coffee mug with ergonomic handle',
          image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
          category: 'Home'
        },
        {
          name: 'Notebook Set',
          price: 399,
          description: 'Set of 3 premium quality notebooks',
          image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
          category: 'Stationery'
        }
      ];
      
      await Product.insertMany(products);
      console.log('Mock products inserted successfully');
    }
  } catch (error) {
    console.error('Error initializing mock data:', error.message);
  }
};

module.exports = connectDB;
