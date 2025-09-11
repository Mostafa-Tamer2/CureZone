"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/product";
import { getAllCategories } from "@/utilities/supabase/products";
import Link from "next/link";
import Container from "@/components/Container/Container";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#184363]">
          Shop by Category
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
              <span className="text-lg text-gray-700">
                Loading categories...
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200">
                    <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                      {/* Category Icon */}
                      <span className="text-4xl text-blue-600">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Browse all {category.name.toLowerCase()} products
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
