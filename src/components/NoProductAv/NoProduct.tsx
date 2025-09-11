"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2, PackageX, RefreshCw } from "lucide-react";

const NoProduct = ({
  selectedTab,
  className,
}: {
  selectedTab?: string;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "flex flex-col items-center justify-center py-12 min-h-96 space-y-6 text-center bg-gradient-to-b from-white to-gray-100 rounded-xl w-full mt-8 shadow-sm border border-gray-200",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative"
      >
        <div className="bg-gray-100 p-6 rounded-full">
          <PackageX className="w-16 h-16 text-shop_dark_green" />
        </div>
        <motion.div
          className="absolute -right-2 -top-2 bg-amber-100 rounded-full p-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-5 h-5 text-amber-600" />
        </motion.div>
      </motion.div>

      <div className="space-y-2 max-w-md mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-700 bg-clip-text text-transparent"
        >
          No Products Available
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-50 px-6 py-3 rounded-lg"
        >
          <p className="text-gray-700">
            We&apos;re sorry, but there are no products matching the{" "}
            {selectedTab && (
              <span className="font-medium text-shop_dark_green inline-block px-2 py-1 bg-blue-100 rounded-md">
                {selectedTab}
              </span>
            )}{" "}
            criteria at the moment.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="flex items-center space-x-3 bg-shop_dark_green/10 px-5 py-3 rounded-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Loader2 className="w-5 h-5 text-shop_dark_green" />
          </motion.div>
          <span className="text-shop_dark_green font-medium">
            We&apos;re restocking shortly
          </span>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4"
        >
          <button className="bg-shop_dark_green hover:bg-shop_dark_green/90 text-white px-6 py-2 rounded-full transition-all duration-200 flex items-center space-x-2">
            <span>Explore Other Categories</span>
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-sm text-gray-500 max-w-xs"
        >
          Please check back later or contact our support team if you need
          assistance.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default NoProduct;
