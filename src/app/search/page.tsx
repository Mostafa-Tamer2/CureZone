"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { searchProducts } from "@/utilities/supabase/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductGrid/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      try {
        if (query) {
          const data = await searchProducts(query);
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    getSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Search Results for: {query}</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading results...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-2">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-gray-400">
            Try using different keywords or check for typos
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
