import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Products API
export const getProducts = () => axios.get(`${API_BASE_URL}/products`);
export const getProduct = (id) => axios.get(`${API_BASE_URL}/products/${id}`);

// Cart API
export const getCart = () => axios.get(`${API_BASE_URL}/cart`);
export const addToCart = (productId, quantity = 1) => 
  axios.post(`${API_BASE_URL}/cart`, { productId, quantity });
export const updateCartItem = (cartId, quantity) => 
  axios.put(`${API_BASE_URL}/cart/${cartId}`, { quantity });
export const removeFromCart = (cartId) => 
  axios.delete(`${API_BASE_URL}/cart/${cartId}`);
export const clearCart = () => axios.delete(`${API_BASE_URL}/cart`);

// Checkout API
export const checkout = (name, email, cartItems) => 
  axios.post(`${API_BASE_URL}/checkout`, { name, email, cartItems });
