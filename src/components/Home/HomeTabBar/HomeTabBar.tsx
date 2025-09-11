import Container from "@/components/Container/Container";
import { productType } from "@/constraints/data";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

export default function HomeTabBar({ selectedTab, onTabSelect }: Props) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <Container>
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Mobile view - dropdown */}
        {isMobile ? (
          <div className="relative w-full md:w-auto z-999">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex justify-between items-center w-full bg-blue-700/20 border border-lightColor/20 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <span>{selectedTab || "Select Category"}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  showMobileMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showMobileMenu && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-lightColor/20 rounded-lg shadow-lg">
                {productType?.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      onTabSelect(item?.title);
                      setShowMobileMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-700/10 ${
                      selectedTab === item?.title
                        ? "bg-blue-700 text-white"
                        : ""
                    }`}
                  >
                    {item?.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Desktop view - horizontal tabs */
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-sm font-semibold overflow-x-auto pb-2 max-w-[75%] scrollbar-hide">
            {productType?.map((item) => (
              <button
                onClick={() => onTabSelect(item?.title)}
                key={item.title}
                className={`whitespace-nowrap border border-lightColor/20 px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full hover:bg-blue-700 hover:border-blue-700 hover:text-white hoverEffect ${
                  selectedTab === item?.title
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-blue-700/20"
                }`}
              >
                {item?.title}
              </button>
            ))}
          </div>
        )}

        {/* See All link - always visible */}
        <Link
          href="/shop"
          className="border border-lightColor/30 px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full hover:bg-blue-700 hover:border-blue-700 hover:text-white hoverEffect whitespace-nowrap"
        >
          See All
        </Link>
      </div>
    </Container>
  );
}
