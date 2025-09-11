"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function Wishlist({}: Props) {
  const { wishlistCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="text-gray-700 hover:text-blue-500 relative"
    >
      <Heart className="h-6 w-6" />
      {wishlistCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </span>
      )}
    </Link>
  );
}
