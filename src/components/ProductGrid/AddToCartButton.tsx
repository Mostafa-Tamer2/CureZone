"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ShoppingCartIcon, Loader2 } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/lib/cart-context";
import CartQuantityControls from "./CartQuantityControls";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({
  product,
  className,
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const isOutOfStock = product?.stock_quantity === 0;
  const [isAdding, setIsAdding] = useState(false);
  const [optimisticIsInCart, setOptimisticIsInCart] = useState(false);
  const lastActionTime = useRef<number>(0);

  // Check actual cart state
  const productInCart = isInCart(product.id) || optimisticIsInCart;

  useEffect(() => {
    if (isInCart(product.id)) {
      setOptimisticIsInCart(false);
    }
  }, [isInCart, product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent rapid clicks by checking last action time
    const now = Date.now();
    if (now - lastActionTime.current < 500) return;
    lastActionTime.current = now;

    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    setOptimisticIsInCart(true);

    try {
      await addToCart(product);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setOptimisticIsInCart(false);
    } finally {
      // Slight delay to ensure smooth transition
      setTimeout(() => {
        setIsAdding(false);
      }, 300);
    }
  };

  // show quantity controls if product is in cart
  if (productInCart) {
    return <CartQuantityControls product={product} className={className} />;
  }

  // show "Add to Cart" button if product is not in cart
  return (
    <Button
      disabled={isOutOfStock || isAdding}
      variant="secondary"
      className={`w-full h-10 mt-3 bg-[#edf4f6] text-[#184363] rounded-[72px] font-bold text-sm font-['PT_Sans',Helvetica] hover:bg-[#d9e9ee] ${className}`}
      onClick={handleAddToCart}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-[18px] h-[18px] mr-2.5 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCartIcon className="w-[18px] h-[18px] mr-2.5" />
          {isOutOfStock ? "Out Of Stock" : "Add to cart"}
        </>
      )}
    </Button>
  );
}
