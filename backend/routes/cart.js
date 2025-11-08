const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart - Get all cart items with product details
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('productId');
    
    const items = cartItems.map(item => ({
      cart_id: item._id,
      quantity: item.quantity,
      product_id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      description: item.productId.description,
      subtotal: item.productId.price * item.quantity
    }));
    
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    res.json({
      items: items,
      total: total,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    console.log(`[CART] Add to cart request - ProductID: ${productId}, Quantity: ${quantity}`);
    
    if (!productId) {
      console.log('[CART] Error: Product ID is missing');
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    if (quantity < 1) {
      console.log('[CART] Error: Invalid quantity');
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`[CART] Error: Product not found - ${productId}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`[CART] Product found: ${product.name}`);
    
    // Check if item already in cart
    const existingCartItem = await Cart.findOne({ productId });
    
    if (existingCartItem) {
      // Update quantity if item exists
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      console.log(`[CART] Updated existing cart item - New quantity: ${existingCartItem.quantity}`);
      
      res.json({
        message: 'Cart updated successfully',
        cartId: existingCartItem._id,
        quantity: existingCartItem.quantity
      });
    } else {
      // Insert new item
      const newCartItem = new Cart({ productId, quantity });
      await newCartItem.save();
      console.log(`[CART] Created new cart item - Cart ID: ${newCartItem._id}`);
      
      res.status(201).json({
        message: 'Item added to cart successfully',
        cartId: newCartItem._id,
        quantity: newCartItem.quantity
      });
    }
  } catch (error) {
    console.error('[CART] Error adding to cart:', error.message);
    console.error('[CART] Stack:', error.stack);
    res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    
    const cartItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({
      message: 'Cart updated successfully',
      quantity: cartItem.quantity
    });
  } catch (error) {
    console.error('Error updating cart:', error.message);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findByIdAndDelete(id);
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error deleting from cart:', error.message);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
