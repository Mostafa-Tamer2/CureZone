"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Product } from "@/types/product";
import {
  getCartItems,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartQuantityUtil,
  clearCart as clearCartUtil,
  cartEvents,
} from "@/utilities/supabase/cart";
import { useAuth } from "./auth-context";

// Define the cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: number) => boolean;
  getCartItemQuantity: (productId: number) => number;
  isLoading: boolean;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cart data on initial render and when user changes
  const fetchCartItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and reload when user changes
  useEffect(() => {
    fetchCartItems();
  }, [user, fetchCartItems]);

  // Listen for cart events (from other components/tabs)
  useEffect(() => {
    const handleCartEvent = () => {
      // Add a small delay to allow operations to complete
      setTimeout(fetchCartItems, 50);
    };

    const unsubscribeAdded = cartEvents.addEventListener(
      "added",
      handleCartEvent
    );
    const unsubscribeRemoved = cartEvents.addEventListener(
      "removed",
      handleCartEvent
    );
    const unsubscribeUpdated = cartEvents.addEventListener(
      "updated",
      handleCartEvent
    );
    const unsubscribeCleared = cartEvents.addEventListener(
      "cleared",
      handleCartEvent
    );

    return () => {
      unsubscribeAdded();
      unsubscribeRemoved();
      unsubscribeUpdated();
      unsubscribeCleared();
    };
  }, [fetchCartItems]);

  // Check if a product is already in the cart
  const isInCart = (productId: number) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  // Get the quantity of a specific cart item
  const getCartItemQuantity = (productId: number) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Add a product to cart
  const addToCart = async (product: Product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { product, quantity: 1 }];
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await addToCartUtil(product);
  };

  // Remove a product from cart
  const removeFromCart = async (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    await removeFromCartUtil(productId);
  };

  // Update the quantity of a cart item
  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    //  update local state first
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    await updateCartQuantityUtil(productId, quantity);
  };

  // Clear the entire cart
  const clearCart = async () => {
    //  clear local state
    setCartItems([]);

    await new Promise((resolve) => setTimeout(resolve, 50));

    await clearCartUtil();
  };

  // Context value
  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity,
    isLoading,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

//  hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
