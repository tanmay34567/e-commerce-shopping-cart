import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import './CheckoutModal.css';

function CheckoutModal({ isOpen, onClose, cartItems, total, onCheckout }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await onCheckout(formData.name, formData.email, cartItems);
      setReceipt(response.data.receipt);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '' });
    setReceipt(null);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <X size={24} />
        </button>

        {!receipt ? (
          <>
            <h2 className="modal-title">Checkout</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {cartItems.map((item) => (
                    <div key={item.cart_id} className="summary-item">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </>
        ) : (
          <div className="receipt">
            <div className="receipt-icon">
              <ShoppingBag size={48} />
            </div>
            <h2 className="receipt-title">Order Confirmed!</h2>
            <p className="receipt-subtitle">Thank you for your purchase</p>
            
            <div className="receipt-details">
              <div className="receipt-row">
                <span>Order ID:</span>
                <span className="receipt-value">{receipt.orderId}</span>
              </div>
              <div className="receipt-row">
                <span>Customer:</span>
                <span className="receipt-value">{receipt.customerName}</span>
              </div>
              <div className="receipt-row">
                <span>Email:</span>
                <span className="receipt-value">{receipt.customerEmail}</span>
              </div>
              <div className="receipt-row">
                <span>Date:</span>
                <span className="receipt-value">
                  {new Date(receipt.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="receipt-items">
              <h3>Items</h3>
              {receipt.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="receipt-total">
              <span>Total Paid</span>
              <span>₹{receipt.total}</span>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
