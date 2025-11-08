import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, addToCart } from '../api';
import './ProductsPage.css';

function ProductsPage({ updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      updateCartCount();
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">Loading products...</div>
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

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Our Products</h1>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
