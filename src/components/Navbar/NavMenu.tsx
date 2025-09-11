"use client";

import { navLinks } from "@/constraints/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getAllCategories } from "@/utilities/supabase/products";
import { Category } from "@/types/product";

export default function NavMenu() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setShowCategoryDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowCategoryDropdown(false);
    }, 300); // 300ms delay before hiding the dropdown
  };

  return (
    <nav
      className={`hidden md:flex w-1/2 items-center justify-center gap-8 transition-all duration-300 ${
        scrolled ? "py-3" : "py-4"
      }`}
    >
      {navLinks?.map((item, index) => {
        const isActive = pathname === item?.href;
        const isShopByCategory = item?.title === "Shop by Category";

        return (
          <motion.div
            key={item?.title}
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onMouseEnter={() => {
              if (isShopByCategory) handleMouseEnter();
            }}
            onMouseLeave={() => {
              if (isShopByCategory) handleMouseLeave();
            }}
          >
            <Link
              href={item?.href}
              className={`relative text-sm font-medium tracking-wide transition-colors duration-300 px-1 py-2 flex items-center ${
                isActive
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {/* Text content */}
              <span className="relative z-10">{item?.title}</span>

              {/* Animated underline */}
              <span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                }}
              />

              {/* Hover effect */}
              <span className="absolute inset-0 bg-blue-50 rounded-md transform scale-95 opacity-0 transition-all duration-300 -z-10 hover:opacity-100 hover:scale-100" />
            </Link>

            {/* "New" badge*/}
            {item?.isNew && (
              <span className="absolute -top-3 -right-6 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                <span className="relative inline-flex">
                  New
                  <span className="absolute -inset-1 bg-green-400 rounded-full opacity-60 animate-ping" />
                </span>
              </span>
            )}

            {/* Category dropdown */}
            {isShopByCategory && showCategoryDropdown && (
              <div
                className="absolute top-full left-0 mt-0 w-56 bg-white rounded-md shadow-lg z-50 py-2 border border-gray-200"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Loading categories...
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}
