const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

// POST /api/checkout - Process checkout
router.post('/', async (req, res) => {
  try {
    const { name, email, cartItems } = req.body;
    console.log(`[CHECKOUT] Processing order for ${name} (${email})`);
    
    // Validate input
    if (!name || !email) {
      console.log('[CHECKOUT] Error: Missing name or email');
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    if (!cartItems || cartItems.length === 0) {
      console.log('[CHECKOUT] Error: Cart is empty');
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate order ID
    const orderId = uuidv4();
    
    // Create order object
    const orderData = {
      orderId: orderId,
      customerName: name,
      customerEmail: email,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      total: total,
      status: 'confirmed'
    };
    
    // Save order to database
    const order = new Order(orderData);
    await order.save();
    console.log(`[CHECKOUT] Order saved to database - Order ID: ${orderId}`);
    
    // Generate receipt
    const receipt = {
      orderId: order.orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      total: order.total,
      timestamp: order.createdAt.toISOString(),
      status: order.status
    };
    
    // Clear cart after successful checkout
    try {
      await Cart.deleteMany({});
      console.log('[CHECKOUT] Cart cleared successfully');
    } catch (err) {
      console.error('[CHECKOUT] Error clearing cart:', err.message);
      // Still return receipt even if cart clear fails
    }
    
    res.json({
      message: 'Order placed successfully',
      receipt: receipt
    });
  } catch (error) {
    console.error('[CHECKOUT] Error processing checkout:', error.message);
    console.error('[CHECKOUT] Stack:', error.stack);
    res.status(500).json({ error: 'Failed to process checkout', details: error.message });
  }
});

// GET /api/checkout/orders - Get all orders (optional - for admin view)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log(`[CHECKOUT] Retrieved ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error('[CHECKOUT] Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/checkout/orders/:orderId - Get specific order
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('[CHECKOUT] Error fetching order:', error.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
