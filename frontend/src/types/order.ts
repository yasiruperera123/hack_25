export interface IOrderItem {
  _id?: string;
  product: string; // Product ID
  name: string;
  quantity: number;
  price: number; // Price at time of purchase
  image: string;
}

export interface IAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IPaymentInfo {
    method: string; // e.g., 'Credit Card', 'PayPal'
    transactionId?: string; // Optional transaction ID from payment gateway
    // Add other relevant payment details (avoid sensitive info here)
}

export interface IOrder {
  _id: string;
  user: string; // User ID
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentInfo?: IPaymentInfo; // Optional payment info
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string; // Date string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Type for the payload sent to create an order
export interface ICreateOrderPayload {
    personalInfo: { name: string; email: string; phone?: string };
    shippingAddress: IAddress;
    // If billing is same as shipping, send same address or a flag
    billingAddress: IAddress; // Or { sameAsShipping: boolean; address?: IAddress }
    paymentInfo?: IPaymentInfo; // Include if integrating payment details during checkout
} 