"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Plus, Minus, Loader2 } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/lib/cart-context";

interface CartQuantityControlsProps {
  product: Product;
  className?: string;
}

export default function CartQuantityControls({
  product,
  className,
}: CartQuantityControlsProps) {
  const { updateQuantity, getCartItemQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(0);
  const [animateQuantity, setAnimateQuantity] = useState(false);

  // Get the actual quantity from cart
  const serverQuantity = getCartItemQuantity(product.id);
  const lastOperation = useRef<{ type: string; timestamp: number } | null>(
    null
  );

  // Initialize local quantity from server quantity
  useEffect(() => {
    const now = Date.now();
    const shouldUpdate =
      !lastOperation.current || now - lastOperation.current.timestamp > 500;

    if (shouldUpdate) {
      setLocalQuantity(serverQuantity);
    }
  }, [serverQuantity]);

  const triggerQuantityAnimation = () => {
    setAnimateQuantity(true);
    setTimeout(() => setAnimateQuantity(false), 300);
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    // Prevent the click from navigating to the product detail page
    e.preventDefault();
    e.stopPropagation();

    // Don't allow operation if already updating or at max stock
    if (localQuantity >= product.stock_quantity || isUpdating) return;

    // Record this operation
    lastOperation.current = { type: "increment", timestamp: Date.now() };
    setIsUpdating(true);
    triggerQuantityAnimation();

    // Optimistically update UI
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);

    try {
      await updateQuantity(product.id, newQuantity);
    } catch (error) {
      // Revert on error
      setLocalQuantity(serverQuantity);
      console.error("Error incrementing quantity:", error);
    } finally {
      // Small delay before allowing another operation to prevent rapid clicks
      setTimeout(() => {
        setIsUpdating(false);
      }, 300);
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    // Prevent the click from navigating to the product detail page
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;

    // Record this operation
    lastOperation.current = { type: "decrement", timestamp: Date.now() };
    setIsUpdating(true);
    triggerQuantityAnimation();

    try {
      if (localQuantity > 1) {
        const newQuantity = localQuantity - 1;
        setLocalQuantity(newQuantity);
        await updateQuantity(product.id, newQuantity);
      } else {
        // Don't update local quantity for removal to avoid flickering
        await removeFromCart(product.id);
      }
    } catch (error) {
      // Revert on error
      setLocalQuantity(serverQuantity);
      console.error("Error decrementing quantity:", error);
    } finally {
      // Small delay before allowing another operation to prevent rapid clicks
      setTimeout(() => {
        setIsUpdating(false);
      }, 300);
    }
  };

  return (
    <div
      className={`flex items-center justify-between ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        onClick={handleDecrement}
        variant="outline"
        size="icon"
        className="
          h-9 w-9 rounded-full relative overflow-hidden
          bg-gradient-to-br from-gray-50 to-gray-100 
          hover:from-red-50 hover:to-red-100
          border-gray-200 hover:border-red-300
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-95
          group
        "
        disabled={isUpdating}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
        ) : (
          <Minus className="h-4 w-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
        )}

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>

      <span
        className={`
        mx-2 font-semibold text-gray-800 min-w-[24px] text-center
        transition-all duration-300 ease-out
        ${animateQuantity ? "scale-110 text-blue-600" : "scale-100"}
      `}
      >
        {localQuantity}
      </span>

      <Button
        onClick={handleIncrement}
        variant="outline"
        size="icon"
        className="
          h-9 w-9 rounded-full relative overflow-hidden
          bg-gradient-to-br from-blue-50 to-blue-100 
          hover:from-blue-100 hover:to-blue-200
          border-blue-200 hover:border-blue-300
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-95
          disabled:from-gray-100 disabled:to-gray-100
          disabled:border-gray-200 disabled:hover:scale-100
          group
        "
        disabled={isUpdating || localQuantity >= product.stock_quantity}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        ) : (
          <Plus className="h-4 w-4 text-blue-600 group-hover:text-blue-700 group-disabled:text-gray-400 transition-colors duration-200" />
        )}

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300" />
      </Button>
    </div>
  );
}
