import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import CartItem from '../components/CartItem';
import CheckoutModal from '../components/CheckoutModal';
import { getCart, updateCartItem, removeFromCart, checkout } from '../api';
import './CartPage.css';

function CartPage({ updateCartCount }) {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartId, quantity) => {
    try {
      await updateCartItem(cartId, quantity);
      await fetchCart();
      updateCartCount();
    } catch (err) {
      console.error('Error updating quantity:', err);
      throw err;
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeFromCart(cartId);
      await fetchCart();
      updateCartCount();
    } catch (err) {
      console.error('Error removing item:', err);
      throw err;
    }
  };

  const handleCheckout = async (name, email, cartItems) => {
    try {
      const response = await checkout(name, email, cartItems);
      await fetchCart();
      updateCartCount();
      return response;
    } catch (err) {
      console.error('Error during checkout:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">Loading cart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingCart size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        
        <div className="cart-layout">
          <div className="cart-items-section">
            {cart.items.map((item) => (
              <CartItem
                key={item.cart_id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Items ({cart.count})</span>
                <span>₹{cart.total}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{cart.total}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={() => setIsCheckoutOpen(true)}
            >
              Proceed to Checkout
            </button>
            <Link to="/" className="btn btn-secondary btn-full">
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart.items}
        total={cart.total}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default CartPage;
