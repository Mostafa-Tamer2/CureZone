import { getProductById } from "@/utilities/supabase/products";
import Container from "@/components/Container/Container";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ProductPrice from "@/components/ProductGrid/ProductPrice";
import AddToCartButton from "@/components/ProductGrid/AddToCartButton";
import AddToWish from "@/components/AddToWish/AddToWish";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, Shield, Truck, RotateCcw } from "lucide-react";

// Define the page props interface
// interface ProductPageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }
interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params first (Next.js 15 requirement)
  // const { id } = await params;

  // // Convert the ID from string to number
  // const productId = parseInt(id, 10);

  // // Validate ID
  // if (isNaN(productId)) {
  //   notFound();
  // }

  // // Fetch the product details
  // const product = await getProductById(productId);

  // // If product not found, show 404
  // if (!product) {
  //   notFound();
  // }

   const productId = parseInt(params.id, 10);

  // Validate ID
  if (isNaN(productId)) {
    notFound();
  }

  // Fetch the product details
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <Container>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-blue-600 transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Back to shop link */}
      <Link
        href="/shop"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors font-medium group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div>
          {/* Main Image */}
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="relative w-full aspect-square">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain rounded-2xl"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Wishlist Button on Image */}
              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                <AddToWish product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-8">
          {/* Category and Share */}
          <div className="flex items-center justify-between">
            {product.category && (
              <Badge
                variant="outline"
                className="text-sm font-medium text-blue-700 border-blue-200 bg-blue-50 px-4 py-2 rounded-full"
              >
                {product.category.name}
              </Badge>
            )}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Product Name */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price Section */}
          <div className="flex items-center space-x-4">
            <ProductPrice
              price={product.price}
              discount={product.discount_percent}
              className="text-3xl font-bold"
            />

            {product.discount_percent && product.discount_percent > 0 && (
              <Badge className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                -{product.discount_percent}% OFF
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <div
              className={`w-3 h-3 rounded-full ${
                product.stock_quantity === 0 ? "bg-red-500" : "bg-green-500"
              } animate-pulse`}
            />
            <span
              className={`font-semibold ${
                product.stock_quantity === 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {product.stock_quantity > 0
                ? `${product.stock_quantity} items available`
                : "Currently out of stock"}
            </span>
          </div>

          {/* Description */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              About this product
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              {product.description ||
                "Discover the perfect blend of quality and style with this exceptional product. Carefully crafted to meet your needs and exceed your expectations."}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
              <Truck className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-800">
                Free Shipping
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
              <Shield className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-800">
                Quality Assured
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
              <RotateCcw className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-800">
                Easy Returns
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            <AddToCartButton
              product={product}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg text-lg"
            />

            <div className="flex items-center justify-center">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <AddToWish product={product} />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-600 space-y-2 pt-4 border-t border-gray-200">
            <p>• Secure payment with SSL encryption</p>
            <p>• 30-day money-back guarantee</p>
            <p>• Customer support available 24/7</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
