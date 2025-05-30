import React from 'react';
import { useCart } from '../context/CartContext';
// import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation
import QuantityControl from '../components/QuantityControl'; // Import QuantityControl

const CartPage = () => {
  const { cart, loading, error, removeItem, updateQuantity, clearCart } = useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error}</div>;
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        {/* <Link to="/products">Continue Shopping</Link> */}
        <button>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cart && cart.items && cart.items.length > 0 && cart.items.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} width="50" />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Price: ${item.price}</p>
                {/* Integrate Quantity Control */}
                <QuantityControl
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item._id!, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item._id!, item.quantity - 1)}
                />
                <button onClick={() => removeItem(item._id!)}>Remove</button>
              </div>
            </div>
          ))}
          <button style={{backgroundColor:'green'}} onClick={clearCart}>Clear Cart</button>
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Subtotal: ${cart.subtotal}</p>
          <p>Tax: ${cart.tax}</p>
          <p>Shipping: ${cart.shipping}</p>
          <h4>Total: ${cart.total}</h4>
          {/* <Link to="/checkout">Proceed to Checkout</Link> */}
          <button style={{backgroundColor:'green'}}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 