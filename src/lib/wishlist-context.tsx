"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  getWishlistItems,
  wishlistEvents,
} from "@/utilities/supabase/wishlist";
import { useAuth } from "./auth-context";

type WishlistContextType = {
  wishlistIds: number[];
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => Promise<{ success: boolean }>;
  removeFromWishlist: (productId: number) => Promise<{ success: boolean }>;
  wishlistCount: number;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load all wishlist data on initial load and when user changes
  useEffect(() => {
    const loadWishlistData = async () => {
      setIsLoading(true);
      try {
        // Get wishlist items directly
        const items = await getWishlistItems();
        // Extract just the IDs
        const ids = items.map((item) => item.id);
        setWishlistIds(ids);
        setWishlistCount(ids.length);
      } catch (error) {
        console.error("Error loading wishlist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlistData();

    // Listen for wishlist events
    const addedUnsubscribe = wishlistEvents.addEventListener("added", () => {
      loadWishlistData();
    });

    const removedUnsubscribe = wishlistEvents.addEventListener(
      "removed",
      () => {
        loadWishlistData();
      }
    );

    return () => {
      addedUnsubscribe();
      removedUnsubscribe();
    };
  }, [user]);

  // Check if a product is in the wishlist (using local state)
  const checkIsInWishlist = (productId: number): boolean => {
    return wishlistIds.includes(productId);
  };

  // Add a product to the wishlist
  const handleAddToWishlist = async (productId: number) => {
    const result = await apiAddToWishlist(productId);
    if (result.success) {
      // Update local state
      if (!wishlistIds.includes(productId)) {
        setWishlistIds([...wishlistIds, productId]);
        setWishlistCount((prev) => prev + 1);
      }
    }
    return result;
  };

  // Remove a product from the wishlist
  const handleRemoveFromWishlist = async (productId: number) => {
    const result = await apiRemoveFromWishlist(productId);
    if (result.success) {
      // Update local state
      setWishlistIds(wishlistIds.filter((id) => id !== productId));
      setWishlistCount((prev) => prev - 1);
    }
    return result;
  };

  const value = {
    wishlistIds,
    isInWishlist: checkIsInWishlist,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    wishlistCount,
    isLoading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
