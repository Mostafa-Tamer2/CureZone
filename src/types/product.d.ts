// Product type definitions based on Supabase schema
export interface Product {
  id: number;
  name: string;
  image_url: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  status: string | null;
  discount_percent: number | null;
  category_id: number;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}
