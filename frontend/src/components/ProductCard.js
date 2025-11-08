import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(product._id || product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button
            className={`btn ${added ? 'btn-success' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {added ? (
              <>
                <Check size={18} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
