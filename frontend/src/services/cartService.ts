import api from '../utils/api';
import { ICart, ICartItem } from '../types/cart';

export const cartService = {
  /**
   * Fetches the user's cart.
   * @returns A promise that resolves with the user's cart.
   */
  async getCart(): Promise<ICart> {
    const response = await api.get<ICart>('/cart');
    return response.data;
  },

  /**
   * Adds a product to the cart or updates quantity if it exists.
   * @param productId The ID of the product to add.
   * @param quantity The quantity to add.
   * @returns A promise that resolves with the updated cart.
   */
  async addItem(productId: string, quantity: number): Promise<ICart> {
    const response = await api.post<ICart>('/cart/add', { productId, quantity });
    return response.data;
  },

  /**
   * Removes an item from the cart.
   * @param itemId The ID of the cart item to remove.
   * @returns A promise that resolves with the updated cart.
   */
  async removeItem(itemId: string): Promise<ICart> {
    const response = await api.delete<ICart>(`/cart/remove/${itemId}`);
    return response.data;
  },

  /**
   * Updates the quantity of a specific item in the cart.
   * @param itemId The ID of the cart item to update.
   * @param quantity The new quantity.
   * @returns A promise that resolves with the updated cart.
   */
  async updateQuantity(itemId: string, quantity: number): Promise<ICart> {
    const response = await api.put<ICart>(`/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  /**
   * Clears all items from the cart.
   * @returns A promise that resolves when the cart is cleared.
   */
  async clearCart(): Promise<void> {
    await api.delete('/cart/clear');
  },

  // Optional: Merge guest cart - this would be handled on login/backend
  // async mergeGuestCart(guestCartId: string): Promise<ICart> {
  //   const response = await api.post<ICart>('/cart/merge', { guestCartId });
  //   return response.data;
  // }
}; 