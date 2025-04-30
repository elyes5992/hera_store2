import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { useUser } from './userContext'; // Assuming you have this to get user/token

// Interface for product details coming from backend population
interface PopulatedProduct {
  _id: string;
  name: string;
  imageUrl: string;
  description?: string; // Added description
  stockCount?: number;
  // Optional: Fields for displaying original price/discount info if needed
  price?: number; // Original price from Product model
  discountPercentage?: number;
  category?: string;
  tags?: string[];
}

// Interface for cart items received from backend
export interface BackendCartItem {
  productId: PopulatedProduct; // The populated product object
  quantity: number;
  priceAtAdd: number; // Price when item was added
}

// Interface for the cart state managed locally (transformed)
export interface CartItem {
  id: string; // Use product._id as the unique identifier
  name: string;
  price: number; // Holds the priceAtAdd value
  imageUrl: string;
  quantity: number;
  description?: string; // Added description
  stockCount?: number;
  // Optional: Add originalPrice and discountPercentage if needed for display
  // originalPrice?: number;
  // discountPercentage?: number;
}

// Interface for the Cart object received from backend
interface BackendCart {
  _id?: string;
  userId: string;
  items: BackendCartItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  // Update takes the *new absolute* quantity
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/cart`; // Your backend cart endpoint

// --- API Helper ---
const getAuthHeaders = (token: string | null) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// Helper to transform backend cart items to frontend format - UPDATED
const transformBackendCart = (backendCart?: BackendCart | null): CartItem[] => {
    if (!backendCart || !backendCart.items) return [];
    return backendCart.items
        .filter(item => item.productId) // Filter out items where product might be deleted
        .map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.priceAtAdd, // Use priceAtAdd for the main price field
            // Assuming backend sends full URL or frontend needs to format it
            imageUrl: item.productId.imageUrl, // Make sure this is the correct, usable URL
            quantity: item.quantity,
            description: item.productId.description, // Map description
            stockCount: item.productId.stockCount,
            // Optional mapping for display:
            // originalPrice: item.productId.price,
            // discountPercentage: item.productId.discountPercentage,
        }));
};


// --- Provider Component ---
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Get user object (contains token)

  // Function to fetch cart from backend
  const fetchCart = useCallback(async () => {
    // Use user object directly (contains token if user exists)
    if (!user) {
      setCartItems([]); // Clear local cart if user logs out
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log('Fetching cart for user:', user._id);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getAuthHeaders(user.token), // Access token via user.token
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data: BackendCart = await response.json();
      console.log('Fetched Cart Data:', data);
      setCartItems(transformBackendCart(data));
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
      setError(err.message || 'Failed to load cart.');
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependency: fetch when user changes

  // Effect to fetch cart when user logs in or component mounts with logged-in user
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]); // Clear cart if user logs out
    }
  }, [user, fetchCart]); // Run when user changes

  // --- Cart Modification Functions ---

  const addItem = useCallback(async (productId: string, quantity: number) => {
    if (!user) {
        setError("Please log in to add items to your cart.");
        return;
    }
    // Calculate the target quantity to send to the backend
    const existingItem = cartItems.find(item => item.id === productId);
    const targetQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

    if (targetQuantity <= 0) {
        console.warn("Attempt to add item resulting in non-positive quantity.");
        // Optionally call removeItem if the intention is reduction to zero
        // await removeItem(productId);
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: getAuthHeaders(user.token), // Use user.token
        body: JSON.stringify({ productId, quantity: targetQuantity }), // Send the NEW total quantity
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item.');
      }
      const updatedCart: BackendCart = await response.json();
      setCartItems(transformBackendCart(updatedCart)); // Update state from backend response
    } catch (err: any) {
      console.error('Failed to add item:', err);
      setError(err.message || 'Failed to add item to cart.');
    } finally {
      setIsLoading(false);
    }
  }, [user, cartItems]); // Depends on user and cartItems (for targetQuantity calc)


  // Removes item or sets quantity to 0
  const removeItem = useCallback(async (productId: string) => {
    if (!user) {
        setError("Please log in to remove items from your cart.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/items/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(user.token), // Use user.token
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
            console.warn(`Item ${productId} not found in backend cart, syncing local state.`);
            // Fetch cart again to ensure consistency, or just remove locally if confident
            // await fetchCart(); // Option 1: Re-fetch
             setCartItems(prevItems => prevItems.filter(item => item.id !== productId)); // Option 2: Optimistic local removal
        } else {
            throw new Error(errorData.message || 'Failed to remove item.');
        }
      } else {
        const updatedCart: BackendCart = await response.json();
        setCartItems(transformBackendCart(updatedCart)); // Update state from backend response
      }
    } catch (err: any) {
      console.error('Failed to remove item:', err);
      setError(err.message || 'Failed to remove item from cart.');
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Only depends on user

  // Updates quantity to a specific new value
  const updateQuantity = useCallback(async (productId: string, newQuantity: number) => {
    if (!user) {
        setError("Please log in to update your cart.");
        return;
    }
    // If new quantity is 0 or less, delegate to removeItem
    if (newQuantity <= 0) {
        await removeItem(productId);
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST', // Use POST for add/update as per backend controller
        headers: getAuthHeaders(user.token), // Use user.token
        body: JSON.stringify({ productId, quantity: newQuantity }), // Send the new absolute quantity
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quantity.');
      }
      const updatedCart: BackendCart = await response.json();
      setCartItems(transformBackendCart(updatedCart)); // Update state from backend response
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
      setError(err.message || 'Failed to update item quantity.');
    } finally {
      setIsLoading(false);
    }
  }, [user, removeItem]); // Depends on user and removeItem (for delegation)


  const clearCart = useCallback(async () => {
     if (!user) {
        setError("Please log in to clear your cart.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'DELETE',
        headers: getAuthHeaders(user.token), // Use user.token
      });
       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear cart.');
      }
       const result = await response.json();
       setCartItems([]); // Clear local state on success
       console.log(result.message);
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setError(err.message || 'Failed to clear cart.');
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Depends on user


  // --- Calculation Functions (operate on local state derived from backend) ---
  const getCartTotal = useCallback(() => {
    // Uses item.price which is mapped from priceAtAdd
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    cartItems,
    isLoading,
    error,
    fetchCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  }), [
      cartItems, isLoading, error, fetchCart, addItem,
      removeItem, updateQuantity, clearCart, getCartTotal, getItemCount
    ]);

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