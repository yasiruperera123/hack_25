import api from '../utils/api';
// Assuming you have order types defined somewhere, e.g., in types/order.ts
// import { IOrder, ICreateOrderPayload } from '../types/order';

// Placeholder types for now
interface IOrder {
    _id: string;
    // add other order properties based on backend schema as needed
    // e.g., items: [], total: number, shippingAddress: {}, etc.
}

interface ICreateOrderPayload {
    personalInfo: any; // Replace with specific type
    shippingAddress: any; // Replace with specific type
    billingAddress: any; // Replace with specific type
    // No need to send cart items, backend uses authenticated user's active cart
}

export const orderService = {
  /**
   * Creates a new order from the user's active cart.
   * @param orderData The order details (personal info, addresses).
   * @returns A promise that resolves with the created order.
   */
  async createOrder(orderData: ICreateOrderPayload): Promise<IOrder> {
    const response = await api.post<IOrder>('/orders', orderData);
    return response.data;
  },

  /**
   * Fetches details for a specific order.
   * @param orderId The ID of the order to fetch.
   * @returns A promise that resolves with the order details.
   */
   async getOrderDetails(orderId: string): Promise<IOrder> {
     const response = await api.get<IOrder>(`/orders/${orderId}`);
     return response.data;
   },

  // TODO: Add functions for fetching user orders, etc.

  // async getUserOrders(): Promise<IOrder[]> {
  //   const response = await api.get<IOrder[]>('/orders');
  //   return response.data;
  // },
}; 