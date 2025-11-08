import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import { getCart } from './api';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const response = await getCart();
      setCartCount(response.data.count || 0);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Navbar cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<ProductsPage updateCartCount={updateCartCount} />} />
          <Route path="/cart" element={<CartPage updateCartCount={updateCartCount} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
