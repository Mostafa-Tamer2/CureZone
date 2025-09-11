import { supabase } from "./client";
import type { Product, Category } from "@/types/product";
import { productType } from "@/constraints/data";

/**
 * Fetch all products from Supabase
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  // Transform the data to match our Product type
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    image_url: item.image_url,
    description: item.description,
    price: item.price,
    stock_quantity: item.stock_quantity,
    status: item.status,
    discount_percent: item.discount_percent,
    category_id: item.category_id,
    category: item.categories,
  }));
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(
  categoryName: string
): Promise<Product[]> {
  try {
    // First, get the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .ilike("name", categoryName)
      .limit(1);

    if (categoryError) {
      console.error("Error fetching category:", categoryError);
      return [];
    }

    if (!categoryData || categoryData.length === 0) {
      console.error(`Category not found: ${categoryName}`);
      return [];
    }

    // Then get products with that category ID
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("category_id", categoryData[0].id);

    if (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }

    // Transform the data to match the Product type
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      image_url: item.image_url,
      description: item.description,
      price: item.price,
      stock_quantity: item.stock_quantity,
      status: item.status,
      discount_percent: item.discount_percent,
      category_id: item.category_id,
      category: item.categories,
    }));
  } catch (error) {
    console.error("Unexpected error in getProductsByCategory:", error);
    return [];
  }
}

/**
 * Fetch products by status (new, hot)
 */
export async function getProductsByStatus(status: string): Promise<Product[]> {
  // Map the product type from constraints to the actual status value in the database
  const productTypeItem = productType.find(
    (item) => item.title.toLowerCase() === status.toLowerCase()
  );

  const statusValue = productTypeItem
    ? productTypeItem.value
    : status.toLowerCase();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("status", statusValue);

  if (error) {
    console.error("Error fetching products by status:", error);
    return [];
  }

  // Transform the data to match our Product type
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    image_url: item.image_url,
    description: item.description,
    price: item.price,
    stock_quantity: item.stock_quantity,
    status: item.status,
    discount_percent: item.discount_percent,
    category_id: item.category_id,
    category: item.categories,
  }));
}

/**
 * Fetch all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

/**
 * Fetch products by category AND status
 * This allows filtering products that belong to a specific category and have a specific status
 */
export async function getProductsByCategoryAndStatus(
  categoryName: string,
  status: string = "new"
): Promise<Product[]> {
  try {
    // First, get the category ID using case-insensitive search
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .ilike("name", categoryName)
      .limit(1);

    if (categoryError) {
      console.error("Error fetching category:", categoryError);
      return [];
    }

    if (!categoryData || categoryData.length === 0) {
      console.error(`Category not found: ${categoryName}`);
      return [];
    }

    // Map the product type from constraints to the actual status value in the database
    const productTypeItem = productType.find(
      (item) => item.title.toLowerCase() === status.toLowerCase()
    );

    const statusValue = productTypeItem
      ? productTypeItem.value
      : status.toLowerCase();

    // Then get products with that category ID and status
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("category_id", categoryData[0].id)
      .eq("status", statusValue);

    if (error) {
      console.error("Error fetching products by category and status:", error);
      return [];
    }

    // Transform the data to match our Product type
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      image_url: item.image_url,
      description: item.description,
      price: item.price,
      stock_quantity: item.stock_quantity,
      status: item.status,
      discount_percent: item.discount_percent,
      category_id: item.category_id,
      category: item.categories,
    }));
  } catch (error) {
    console.error("Unexpected error in getProductsByCategoryAndStatus:", error);
    return [];
  }
}

/**
 * Fetch a single product by ID for product details page
 */
export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }

  // Transform the data to match our Product type
  return {
    id: data.id,
    name: data.name,
    image_url: data.image_url,
    description: data.description,
    price: data.price,
    stock_quantity: data.stock_quantity,
    status: data.status,
    discount_percent: data.discount_percent,
    category_id: data.category_id,
    category: data.categories,
  };
}

/**
 * Search products by query string
 * This searches for products where the name or description contains the search query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  // Transform the data to match our Product type
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    image_url: item.image_url,
    description: item.description,
    price: item.price,
    stock_quantity: item.stock_quantity,
    status: item.status,
    discount_percent: item.discount_percent,
    category_id: item.category_id,
    category: item.categories,
  }));
}
