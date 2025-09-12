import { supabase } from "./client";
import type { Product, Category } from "@/types/product";

// Define types for orders
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: string;
  order_date: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: "card" | "cod";
  shipping_details: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items?: OrderItem[];
}

/**
 * Get all orders for the current user
 */
export async function getUserOrders(): Promise<Order[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    // Get all orders for the user
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("order_date", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return (orders ?? []) as unknown as Order[];
  } catch (err) {
    console.error("Unexpected error in getUserOrders:", err);
    return [];
  }
}

/**
 * Get a specific order with its items
 */
export async function getOrderDetails(orderId: number): Promise<Order | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Get the order
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return null;
    }

    if (!order) {
      return null;
    }

    // Get the order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return order as unknown as Order;
    }

    // Get product details for each item
    if (orderItems && orderItems.length > 0) {
      const productIds = orderItems.map((item) => item.product_id);
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*, categories(*)")
        .in("id", productIds);

      if (productsError) {
        console.error("Error fetching products for order:", productsError);
      } else if (products) {
        // Add product details to each order item
        type ProductRow = Product & { categories?: Category };
        const prodRows: ProductRow[] =
          (products as unknown as ProductRow[]) ?? [];
        const itemsWithProducts = orderItems.map((item) => {
          const product = prodRows.find((p) => p.id === item.product_id);
          return {
            ...item,
            product: product
              ? {
                  ...product,
                  category: product.categories,
                }
              : undefined,
          };
        });
        (order as unknown as Order).items =
          itemsWithProducts as unknown as OrderItem[];
      }
    } else {
      (order as unknown as Order).items = [];
    }

    return order as unknown as Order;
  } catch (err) {
    console.error("Unexpected error in getOrderDetails:", err);
    return null;
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: number): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    // Update order status to cancelled
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .eq("user_id", user.id)
      .eq("status", "pending"); // Only allow cancellation of pending orders

    if (error) {
      console.error("Error cancelling order:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error in cancelOrder:", err);
    return false;
  }
}
