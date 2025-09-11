import Container from "@/components/Container/Container";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductLoading() {
  return (
    <Container>
      {/* Back to shop link */}
      <Link
        href="/shop"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image Skeleton */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center">
          <div className="relative w-full aspect-square">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          {/* Category */}
          <Skeleton className="h-6 w-24 rounded-full" />

          {/* Product Name */}
          <Skeleton className="h-10 w-3/4 rounded-md" />

          {/* Price */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>

          {/* Description */}
          <div className="py-4 border-t border-b border-gray-200 space-y-3">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>

          {/* Stock Info */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 pt-4">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </Container>
  );
}
