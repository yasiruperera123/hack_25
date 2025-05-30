import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ICart, ICartItem } from '../types/cart'; // Assuming you have cart types defined
import { cartService } from '../services/cartService'; // We will create this service next
import { useAuth } from './AuthContext'; // Assuming an AuthContext exists

interface CartContextType {
  cart: ICart | null;
  loading: boolean;
  error: string | null;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<void>;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get user from AuthContext

  // Fetch cart on initial load or user change
  const getCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCart = await cartService.getCart();
      setCart(userCart);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart');
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addItem = async (productId: string, quantity: number) => {
    // Optimistic update (optional but good UX)
    // const prevCart = cart;
    // setCart((currentCart) => {
    //   // Logic to optimistically add item
    //   return updatedCart;
    // });
    // try {
    //   const updatedCart = await cartService.addItem(productId, quantity);
    //   setCart(updatedCart);
    // } catch (err: any) {
    //   setError(err.message || 'Failed to add item to cart');
    //   setCart(prevCart); // Revert on error
    // } finally {
    //   // Maybe a separate loading state for item addition
    // }
    
    // Non-optimistic update:
     setLoading(true);
     setError(null);
     try {
       const updatedCart = await cartService.addItem(productId, quantity);
       setCart(updatedCart);
     } catch (err: any) {
       setError(err.message || 'Failed to add item to cart');
       console.error('Failed to add item to cart', err);
     } finally {
       setLoading(false);
     }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    // Similar optimistic/non-optimistic logic as addItem
     setLoading(true);
     setError(null);
     try {
       const updatedCart = await cartService.removeItem(itemId);
       setCart(updatedCart);
     } catch (err: any) {
       setError(err.message || 'Failed to remove item from cart');
       console.error('Failed to remove item from cart', err);
     } finally {
       setLoading(false);
     }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
     setLoading(true);
     setError(null);
     try {
       const updatedCart = await cartService.updateQuantity(itemId, quantity);
       setCart(updatedCart);
     } catch (err: any) {
       setError(err.message || 'Failed to update item quantity');
       console.error('Failed to update item quantity', err);
     } finally {
       setLoading(false);
     }
  };

  // Clear the entire cart
  const clearCart = async () => {
     setLoading(true);
     setError(null);
     try {
       await cartService.clearCart();
       setCart(null); // Or an empty cart structure
     } catch (err: any) {
       setError(err.message || 'Failed to clear cart');
       console.error('Failed to clear cart', err);
     } finally {
       setLoading(false);
     }
  };

  // Calculate cart item count
  const cartItemCount = cart?.items?.reduce((count: number, item: ICartItem) => count + item.quantity, 0) || 0;

  // Calculate cart total (using backend calculated total for now)
  const cartTotal = cart?.total || 0;

  useEffect(() => {
    // Fetch cart when the user changes or on mount
    // Need to handle guest carts vs logged-in user carts
    // For now, just fetch if a user exists
    if (user) {
      getCart();
    } else {
      // Handle guest cart loading (e.g., from localStorage)
      // For simplicity, we'll assume no guest cart for now
      setCart(null);
      setLoading(false);
    }
  }, [user]); // Depend on user to refetch cart on login/logout

  // Optional: Persist cart state for guest users using localStorage
  // useEffect(() => {
  //   if (!user) {
  //     localStorage.setItem('guestCart', JSON.stringify(cart));
  //   }
  // }, [cart, user]);

  // Optional: Load guest cart on initial mount if no user
  // useEffect(() => {
  //   if (!user) {
  //     const savedCart = localStorage.getItem('guestCart');
  //     if (savedCart) {
  //       try {
  //         setCart(JSON.parse(savedCart));
  //       } catch (e) {
  //         console.error('Failed to parse guest cart from localStorage', e);
  //         localStorage.removeItem('guestCart');
  //       }
  //     } else {
  //        setCart(null);
  //     }
  //     setLoading(false);
  //   }
  // }, [user]); // Only run once on mount or user change



  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCart,
        cartItemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 