import React from "react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import AddToWish from "../AddToWish/AddToWish";
import ProductPrice from "./ProductPrice";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/types/product";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group">
      {/* Card Design */}
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden bg-white rounded-2xl backdrop-blur-sm py-0 pb-12">
        <div className="relative overflow-hidden">
          {/* Product Image Container - Clickable to product details */}
          <Link href={`/productdetails/${product.id}`}>
            <div className="w-full h-72 rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-50 transition-all duration-500">
              {product?.image_url && (
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    width={700}
                    height={700}
                    className={`w-full h-full object-contain transition-all duration-500 ease-out p-3 ${
                      product?.stock_quantity !== 0
                        ? "group-hover:scale-110 group-hover:rotate-1"
                        : "opacity-40 grayscale"
                    }`}
                  />
                  {/* Overlay gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              {/* Add To wish List */}
              <div className="absolute top-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <AddToWish product={product} />
              </div>

              {/* New Arrivals Product */}
              {product?.status === "new" && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-[pulseGlow_2s_infinite] border-2 border-white/20">
                  ✨ New!
                </Badge>
              )}

              {/* Stock Status Indicator */}
              {product?.stock_quantity === 0 && (
                <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-t-2xl">
                  <Badge className="bg-red-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details Container - Fixed Height */}
        <CardContent className="p-6 h-56 flex flex-col justify-between">
          <Link href={`/productdetails/${product.id}`}>
            <div className="space-y-3">
              {/* Product Category */}
              <div className="flex items-center h-6">
                {product?.category && (
                  <Badge
                    variant="outline"
                    className="text-xs font-medium text-blue-600 border-blue-200 bg-blue-50 px-2 py-1 rounded-full"
                  >
                    {product.category.name}
                  </Badge>
                )}
              </div>

              {/* Product Title - Fixed Height */}
              <div className="h-12">
                <h3 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 h-full overflow-hidden">
                  {product?.name}
                </h3>
              </div>

              {/* Product price */}
              <div className="flex items-center justify-between h-8">
                <ProductPrice
                  price={product?.price}
                  discount={product?.discount_percent}
                  className="text-lg font-bold"
                />
                {product?.discount_percent && product.discount_percent > 0 && (
                  <Badge className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount_percent}%
                  </Badge>
                )}
              </div>

              {/* Stock Information */}
              <div className="flex items-center justify-between text-sm h-6">
                <span className="text-gray-600 font-medium">Availability:</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product?.stock_quantity === 0
                        ? "bg-red-400"
                        : "bg-green-400"
                    } animate-pulse`}
                  />
                  <span
                    className={`font-semibold ${
                      product?.stock_quantity === 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {(product?.stock_quantity as number) > 0
                      ? `${product.stock_quantity} in stock`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Add To Cart Button - Always at bottom and NOT wrapped in Link */}
          <div className="mt-auto">
            <AddToCartButton
              product={product}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Animations */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 12px 3px rgba(34, 197, 94, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px 6px rgba(34, 197, 94, 0.6);
            transform: scale(1.05);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .group:hover .shadow-lg {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
