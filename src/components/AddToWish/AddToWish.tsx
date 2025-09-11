"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useWishlist } from "@/lib/wishlist-context";
import toast from "react-hot-toast";

interface AddToWishProps {
  product: Product;
  className?: string;
}

export default function AddToWish({ product, className }: AddToWishProps) {
  const [loading, setLoading] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const productId = product.id;

  // Check if product is in wishlist using the context
  const inWishlist = isInWishlist(productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);

    try {
      if (inWishlist) {
        // Remove from wishlist
        const result = await removeFromWishlist(productId);
        if (result.success) {
          toast.success("Product removed from wishlist");
        } else {
          toast.error("Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const result = await addToWishlist(productId);
        if (result.success) {
          toast.success("Product added to wishlist");
        } else {
          toast.error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("absolute top-2 right-2 z-10", className)}>
      <button
        className={`p-2.5 rounded-full ${
          inWishlist
            ? "bg-red-50 text-red-500"
            : "hover:text-red-700 hover:bg-white"
        } transition-all duration-300 disabled:opacity-50`}
        onClick={handleToggleWishlist}
        disabled={loading}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={20}
          fill={inWishlist ? "currentColor" : "none"}
          className={loading ? "animate-pulse" : ""}
        />
      </button>
    </div>
  );
}
