"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useCart } from "@/lib/cart-context";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function CartIcon({}: Props) {
  const { cartItems } = useCart();

  // Calculate total quantity from cart items directly
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Link href={"/cart"} className="relative text-gray-700 hover:text-blue-500">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
