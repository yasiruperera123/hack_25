export interface ICartItem {
  _id?: string; // Optional, might not be present until saved
  product: string; // Product ID
  name: string;
  quantity: number;
  price: number; // Price per item
  image: string; // Main product image URL
}

export interface ICart {
  _id?: string; // Optional, might not be present until saved
  user: string; // User ID
  sessionId?: string; // Optional for guest carts
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'active' | 'ordered' | 'abandoned'; // Cart status
  createdAt: string;
  updatedAt: string;
} 