import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
// Assuming you have order types defined somewhere, e.g., in types/order.ts
// import { IOrder } from '../types/order';

// Placeholder type for now (should match backend order structure)
interface IOrder {
    _id: string;
    // Add other relevant order details you want to display
    // e.g., items: { name: string, quantity: number }[];
    // total: number;
    // shippingAddress: { address1: string, city: string, ... };
}

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID not provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const orderDetails = await orderService.getOrderDetails(orderId); // Need to implement getOrderDetails in orderService
        setOrder(orderDetails);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order details.');
        console.error('Failed to fetch order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Refetch if orderId changes

  if (loading) {
    return <div className="container mx-auto p-4">Loading order details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  if (!order) {
     return <div className="container mx-auto p-4">Order not found or could not be loaded.</div>;
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Order Placed Successfully!</h1>
      <p className="text-xl mb-4">Thank you for your order.</p>
      <p className="text-lg mb-8">Your Order Number is: <span className="font-semibold">{order._id}</span></p>

      {/* TODO: Display more order details (items, total, shipping address etc.) */}
      {/* Example: */}
      {/*
      <div className="mt-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
           <ul>
               {order.items.map(item => (
                   <li key={item._id}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
               ))}
           </ul>
           <p className="mt-4 font-bold">Total: ${order.total.toFixed(2)}</p>
      </div>
      */}

      {/* Example link back to homepage or order history */}
      {/* <Link to="/">Continue Shopping</Link> */}
    </div>
  );
};

export default OrderConfirmationPage; 