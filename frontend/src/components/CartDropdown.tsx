import React from 'react';
import { useCart } from '../context/CartContext';
// import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation

const CartDropdown = () => {
  const { cart, loading, error, cartItemCount, cartTotal } = useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error}</div>;
  }

  // Basic rendering for now
  return (
    <div className="cart-dropdown">
      <h3>Shopping Cart ({cartItemCount})</h3>
      {cart && cart.items.length > 0 ? (
        <div>
          {/* Mini list of items (optional for dropdown, maybe just count/total) */}
          {/* cart.items.map(item => ( ... )) */}
          <p>Subtotal: ${cart.subtotal.toFixed(2)}</p>
          {/* Add Tax, Shipping, Total if needed here */}
          <div className="cart-dropdown-actions">
            {/* <Link to="/cart">View Cart</Link> */}
            {/* <Link to="/checkout">Checkout</Link> */}
            <button>View Cart</button>
            <button>Checkout</button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartDropdown; 