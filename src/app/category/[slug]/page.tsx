"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { getProductsByCategory } from "@/utilities/supabase/products";
import Filter from "@/components/Filter/Filter";
import ProductCard from "@/components/ProductGrid/ProductCard";
import NoProduct from "@/components/NoProductAv/NoProduct";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container/Container";

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(false);
  const categoryName = typeof slug === "string" ? slug.replace(/-/g, " ") : "";

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setCategoryError(false);

      if (categoryName) {
        try {
          const productsData = await getProductsByCategory(categoryName);
          setProducts(productsData);
          setFilteredProducts(productsData);

          // If no products were found
          if (productsData.length === 0) {
            console.log(`No products found for category: ${categoryName}`);
          }
        } catch (error) {
          console.error(
            `Error fetching products for category ${categoryName}:`,
            error
          );
          setCategoryError(true);
        }
      }

      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

  const handleFilterChange = (filters: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }) => {
    let filtered = [...products];

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.minPrice! &&
          product.price <= filters.maxPrice!
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (product) => product.status === filters.status
      );
    }

    setFilteredProducts(filtered);
  };

  // Catch the error of loading the category
  if (categoryError) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The category &quot;{categoryName}&quot; could not be found.
          </p>
          <button
            onClick={() => router.push("/shop-by-category")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Browse All Categories
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{categoryName}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Filter
              onFilterChange={handleFilterChange}
              showStatusFilter={true}
            />
          </div>

          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-lg h-80 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <NoProduct />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
