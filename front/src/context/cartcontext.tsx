// src/context/CartContext.tsx
import React, { createContext, useState, useContext, useMemo, ReactNode, useCallback } from 'react';

// Define interfaces (can be shared or defined here)
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  // Add other relevant product fields if needed
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void; // delta can be +1 or -1
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

// Create the context with a default value (can be null or default object)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // Add new item to cart
        return [...prevItems, { ...item, quantity }];
      }
    });
    console.log("Cart Updated (Add):", cartItems); // Log state after update attempt
  }, [cartItems]); // Dependency array includes cartItems


  const removeItem = useCallback((id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    console.log("Cart Updated (Remove):", cartItems); // Log state after update attempt
  }, [cartItems]); // Dependency array includes cartItems


  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) } // Allow quantity 0 temporarily
            : item
        )
        .filter((item) => item.quantity > 0) // Remove item if quantity becomes 0
    );
     console.log("Cart Updated (Quantity):", cartItems); // Log state after update attempt
  }, [cartItems]); // Dependency array includes cartItems


  const clearCart = useCallback(() => {
    setCartItems([]);
     console.log("Cart Cleared");
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getItemCount = useCallback(() => {
      return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  }), [cartItems, addItem, removeItem, updateQuantity, clearCart, getCartTotal, getItemCount]);


  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};