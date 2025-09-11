"use client";
import React, { useEffect, useState } from "react";
import HomeTabBar from "../Home/HomeTabBar/HomeTabBar";
import { productType } from "@/constraints/data";
import { AnimatePresence, motion } from "motion/react";
import { BadgePercent, Loader2 } from "lucide-react";
import Container from "../Container/Container";
import NoProduct from "../NoProductAv/NoProduct";
import ProductCard from "./ProductCard";
import {
  getAllProducts,
  getProductsByCategoryAndStatus,
} from "@/utilities/supabase/products";
import type { Product } from "@/types/product";

// Props for the ProductGrid component
type Props = {
  statusFilter?: string;
};

export default function ProductGrid({ statusFilter = "new" }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedProducts: Product[] = [];

        if (selectedTab.toLowerCase() === "all") {
          // For "All" tab, get all products with status = new
          fetchedProducts = await getAllProducts();
          // Filter show only products with status = new
          fetchedProducts = fetchedProducts.filter(
            (product) =>
              product.status?.toLowerCase() === statusFilter.toLowerCase()
          );
        } else {
          // For specific category tabs, get products from that category with status = new
          fetchedProducts = await getProductsByCategoryAndStatus(
            selectedTab,
            statusFilter
          );
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Product Fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, statusFilter]);

  return (
    <div>
      <div className="relative flex items-center justify-center mb-8 w-full">
        {/* Left Gradient Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full hidden md:block" />

        {/* Centered Heading */}
        <div className="relative z-10 flex items-center space-x-2">
          <BadgePercent className="h-6 w-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-[#184363]">New Products</h2>
        </div>

        {/* Right Gradient Line */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-l from-transparent to-blue-500 rounded-full hidden md:block" />
      </div>

      <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      {/* Section Container */}
      <Container>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 gap-4 bg-gray-100 w-full mt-10">
            <div className="space-x-2 flex items-center text-blue-700">
              <Loader2 className="w-5 h-6 animate-spin" />
              <span>Products is loading...</span>
            </div>
          </div>
        ) : products?.length ? (
          //Product Fetch Section and Grid
          <div className="grid grid-cols-2 md:grid-col-3 lg:grid-cols-3 gap-3 mt-10">
            {products.map((product) => (
              <AnimatePresence key={product.id}>
                {/* Animation While Fetching and Change */}
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          // No Product Available Section
          <NoProduct selectedTab={selectedTab} />
        )}
      </Container>
    </div>
  );
}
