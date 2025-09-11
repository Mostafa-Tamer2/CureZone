"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/product";
import { getAllCategories } from "@/utilities/supabase/products";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { productType } from "@/constraints/data";

interface FilterProps {
  onFilterChange: (filters: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }) => void;
  showStatusFilter?: boolean;
}

export default function Filter({
  onFilterChange,
  showStatusFilter = false,
}: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
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

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(
      categoryId === selectedCategory ? undefined : categoryId
    );
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === selectedStatus ? undefined : status);
  };

  const applyFilters = () => {
    onFilterChange({
      categoryId: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      status: selectedStatus,
    });
  };

  const resetFilters = () => {
    setSelectedCategory(undefined);
    setPriceRange([0, 1000]);
    setSelectedStatus(undefined);
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Products</h3>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            {isLoading ? (
              <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-1 py-4">
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {showStatusFilter && (
          <AccordionItem value="status">
            <AccordionTrigger className="text-sm font-medium">
              Product Type
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {productType.map((type) => (
                  <div key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`status-${type.value}`}
                      checked={selectedStatus === type.value}
                      onChange={() => handleStatusChange(type.value)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`status-${type.value}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {type.title}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <div className="flex gap-2 mt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={resetFilters} variant="outline" className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}
