import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Store } from 'lucide-react';
import './Navbar.css';

function Navbar({ cartCount }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <Store size={28} />
          <span>Vibe Commerce</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/cart" 
            className={`navbar-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
