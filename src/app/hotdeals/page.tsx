// app/deals/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getProductsByStatus } from "@/utilities/supabase/products";
import Container from "@/components/Container/Container";
import NoProduct from "@/components/NoProductAv/NoProduct";
import ProductsGrid from "@/components/ProductGrid/ProductsGrid";
import Filter from "@/components/Filter/Filter";
import { Product } from "@/types/product";

export default function HotDealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const productsData = await getProductsByStatus("hot");
      setProducts(productsData);
      setFilteredProducts(productsData);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filters: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    let filtered = [...products];

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter(
        (product) => product.category_id === filters.categoryId
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        (product) =>
          product.price >= (filters.minPrice || 0) &&
          product.price <= (filters.maxPrice || 1000)
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <Container>
      <h2 className="text-2xl font-semibold my-6">🔥 Hot Deals</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="md:col-span-1">
          <Filter
            onFilterChange={handleFilterChange}
            showStatusFilter={false}
          />
        </div>
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 rounded-lg h-64"
                />
              ))}
            </div>
          ) : filteredProducts?.length ? (
            <ProductsGrid products={filteredProducts} />
          ) : (
            <NoProduct />
          )}
        </div>
      </div>
    </Container>
  );
}
