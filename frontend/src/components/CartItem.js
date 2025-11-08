import React, { useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import './CartItem.css';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.cart_id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await onRemove(item.cart_id);
    } catch (error) {
      console.error('Error removing item:', error);
      setIsUpdating(false);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-description">{item.description}</p>
        <p className="cart-item-price">₹{item.price}</p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="cart-item-subtotal">
          <span className="subtotal-label">Subtotal:</span>
          <span className="subtotal-value">₹{item.subtotal}</span>
        </div>
        <button
          className="btn btn-danger btn-remove"
          onClick={handleRemove}
          disabled={isUpdating}
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
