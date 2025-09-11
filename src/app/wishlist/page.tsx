"use client";

import React, { useEffect, useState } from "react";
import { getWishlistItems } from "@/utilities/supabase/wishlist";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash, ShoppingCart, Heart } from "lucide-react";
import ProductPrice from "@/components/ProductGrid/ProductPrice";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { removeFromWishlist } = useWishlist();

  const fetchWishlistItems = async () => {
    setLoading(true);
    try {
      // Test Wishlist
      console.log("Fetching wishlist items...");
      const items = await getWishlistItems();
      console.log("Wishlist items received:", items);
      setProducts(items);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      toast.error("Failed to load wishlist items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const result = await removeFromWishlist(productId);
      if (result.success) {
        // Remove the product from local state
        setProducts(products.filter((product) => product.id !== productId));
        toast.success("Item removed from wishlist");
      } else {
        toast.error("Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Cart Add Handler
  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
              <div className="h-4 w-48 bg-blue-200 rounded"></div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center">
                <Heart className="h-20 w-20 text-blue-200" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Items you add to your wishlist will be saved here.
            </p>
            <Link href="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 divide-y">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-6 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <Link
                        href={`/shop/${product.id}`}
                        className="hover:underline"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {product.name}
                        </h3>
                      </Link>

                      {product.category && (
                        <Badge
                          variant="outline"
                          className="mb-2 text-xs text-blue-600 border-blue-200 bg-blue-50"
                        >
                          {product.category.name}
                        </Badge>
                      )}

                      <div className="flex items-center mt-2">
                        <ProductPrice
                          price={product.price}
                          discount={product.discount_percent}
                          className="text-lg font-bold"
                        />

                        {product.discount_percent &&
                          product.discount_percent > 0 && (
                            <Badge className="ml-2 bg-red-100 text-red-600 text-xs">
                              -{product.discount_percent}% OFF
                            </Badge>
                          )}
                      </div>

                      <div className="mt-2 flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            product.stock_quantity > 0
                              ? "bg-green-400"
                              : "bg-red-400"
                          } mr-2`}
                        ></div>
                        <span
                          className={`text-sm ${
                            product.stock_quantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock_quantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 self-stretch sm:self-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        <Trash size={18} />
                      </Button>

                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={product.stock_quantity === 0}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        <span>Add to Cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
