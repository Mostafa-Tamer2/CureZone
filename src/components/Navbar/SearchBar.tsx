"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import React, { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/utilities/supabase/products";
import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function SearchBar({}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle search form submission
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProducts(debouncedSearchQuery);
        setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full h-16 bg-[#edf4f6] border-b border-[#d6eaf9] flex items-center justify-center">
      <div className="relative w-full max-w-[1240px] h-full mx-auto px-4">
        <div className="relative flex items-center justify-center w-full h-full">
          <form onSubmit={handleSearch} className="w-full relative">
            <div className="relative flex items-center w-full bg-white rounded-[45px] border border-solid overflow-hidden">
              <Input
                className="h-[47px] border-none pl-4 font-['PT_Sans',Helvetica] text-sm text-[#184363] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
              />
              <Button
                className="h-[47px] w-14 rounded-[0px_47px_47px_0px] bg-[#15a9e3] hover:bg-[#15a9e3]/90 cursor-pointer"
                type="submit"
              >
                <SearchIcon className="h-5 w-5 text-white" />
                <span className="sr-only">SearchIcon</span>
              </Button>
            </div>

            {/* Search suggestions dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading suggestions...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    {suggestions.map((product) => (
                      <Link
                        key={product.id}
                        href={`/productdetails/${product.id}`}
                        className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          {product.image_url && (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-3 flex-grow">
                          <p className="text-sm font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-blue-600">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                        {product.category && (
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                            {product.category.name}
                          </span>
                        )}
                      </Link>
                    ))}
                    <div className="p-2 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSuggestions(false);
                          router.push(
                            `/search?q=${encodeURIComponent(
                              searchQuery.trim()
                            )}`
                          );
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-1"
                      >
                        See all results for &ldquo;{searchQuery}&rdquo;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  );
}
