import Container from "@/components/Container/Container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function ProductNotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-100 p-6 rounded-full mb-6">
          <ShoppingBag className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 max-w-md mb-8">
          We couldn&apos;t find the product you&apos;re looking for. It may have
          been removed or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/shop" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
