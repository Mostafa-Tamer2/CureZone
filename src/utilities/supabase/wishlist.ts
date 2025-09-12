import { supabase } from "./client";
import type { Product, Category } from "@/types/product";

// Simple event system for wishlist changes
type WishlistEventType = "added" | "removed";

type WishlistEventListener = () => void;

class WishlistEventEmitter {
  private listeners: Record<WishlistEventType, WishlistEventListener[]> = {
    added: [],
    removed: [],
  };

  addEventListener(event: WishlistEventType, callback: WishlistEventListener) {
    this.listeners[event].push(callback);

    // Return an unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      );
    };
  }

  emit(event: WishlistEventType) {
    this.listeners[event].forEach((callback) => callback());
  }
}

export const wishlistEvents = new WishlistEventEmitter();

// Local storage key for guest users' wishlist
const GUEST_WISHLIST_KEY = "curezone_guest_wishlist";

/**
 * Gets the guest wishlist from localStorage
 */
function getGuestWishlist(): number[] {
  if (typeof window === "undefined") return [];

  const storedWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
  if (!storedWishlist) return [];

  try {
    return JSON.parse(storedWishlist);
  } catch (e) {
    console.error("Error parsing guest wishlist:", e);
    return [];
  }
}

/**
 * Saves the guest wishlist to localStorage
 */
function saveGuestWishlist(productIds: number[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(productIds));
}

/**
 * Add a product to the user's wishlist
 */
export async function addToWishlist(productId: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Add to database
    // Check if product is already in wishlist
    const { data: existingItem } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existingItem) {
      // Item already exists in wishlist
      return { success: true, isNew: false };
    }

    // Add product to wishlist
    const { error } = await supabase.from("wishlist").insert({
      user_id: user.id,
      product_id: productId,
    });

    if (error) {
      console.error("Error adding to wishlist:", error);
      return { success: false, error };
    }
  } else {
    // Guest user: Add to localStorage
    const guestWishlist = getGuestWishlist();

    // Check if product is already in guest wishlist
    if (guestWishlist.includes(productId)) {
      return { success: true, isNew: false };
    }

    // Add to guest wishlist
    guestWishlist.push(productId);
    saveGuestWishlist(guestWishlist);
  }

  // Emit event to notify listeners
  wishlistEvents.emit("added");

  return { success: true, isNew: true };
}

/**
 * Remove a product from the user's wishlist
 */
export async function removeFromWishlist(productId: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Remove from database
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing from wishlist:", error);
      return { success: false, error };
    }
  } else {
    // Guest user: Remove from localStorage
    const guestWishlist = getGuestWishlist();
    const updatedWishlist = guestWishlist.filter((id) => id !== productId);
    saveGuestWishlist(updatedWishlist);
  }

  // Emit event to notify listeners
  wishlistEvents.emit("removed");

  return { success: true };
}

/**
 * Get all items in the user's wishlist
 */
export async function getWishlistItems(): Promise<Product[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Logged-in user: Get from database
      console.log("getWishlistItems: Fetching for user", user.id);

      // Get the wishlist items with product details
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products!inner(*)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching wishlist:", error);
        return [];
      }

      console.log("Raw wishlist data:", JSON.stringify(data, null, 2));

      // If no data or empty array, return empty array
      if (!data || data.length === 0) {
        return [];
      }

      // Make a second query to get all product details including categories
      type WishlistRow = { product_id: number };
      const wishlistRows: WishlistRow[] = (data ??
        []) as unknown as WishlistRow[];
      const productIds: number[] = wishlistRows.map((item) => item.product_id);

      const { data: productsWithCategories, error: productsError } =
        await supabase
          .from("products")
          .select("*, categories(*)")
          .in("id", productIds);

      if (productsError) {
        console.error("Error fetching product details:", productsError);
        return [];
      }

      console.log(
        "Products with categories:",
        JSON.stringify(productsWithCategories, null, 2)
      );

      // Map the products to our expected format
      type ProductRow = Product & { categories: Category };
      const productRows: ProductRow[] = (productsWithCategories ??
        []) as unknown as ProductRow[];
      const products: Product[] = productRows.map((product) => ({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        status: product.status,
        discount_percent: product.discount_percent ?? 0,
        category_id: product.category_id,
        category: product.categories,
      }));

      console.log("Final products:", products);
      return products;
    } else {
      // Guest user: Get from localStorage
      const guestWishlistIds = getGuestWishlist();

      if (guestWishlistIds.length === 0) {
        return [];
      }

      // Fetch product details from Supabase
      const { data: products, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .in("id", guestWishlistIds);

      if (error) {
        console.error("Error fetching guest wishlist products:", error);
        return [];
      }

      // Map the products to our expected format
      type ProductRow = Product & { categories: Category };
      const rows: ProductRow[] = (products ?? []) as unknown as ProductRow[];
      return rows.map((product) => ({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        status: product.status,
        discount_percent: product.discount_percent ?? 0,
        category_id: product.category_id,
        category: product.categories,
      }));
    }
  } catch (err) {
    console.error("Unexpected error in getWishlistItems:", err);
    return [];
  }
}

/**
 * Check if a product is in the user's wishlist
 */
export async function isInWishlist(productId: number): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Check database
    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (error && error.code !== "PGRST116") {
      //"No rows returned" error
      console.error("Error checking wishlist:", error);
    }

    return !!data;
  } else {
    // Guest user: Check localStorage
    const guestWishlist = getGuestWishlist();
    return guestWishlist.includes(productId);
  }
}

/**
 * Get the count of items in the user's wishlist
 */
export async function getWishlistCount(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Count from database
    const { count, error } = await supabase
      .from("wishlist")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error counting wishlist items:", error);
      return 0;
    }

    return count || 0;
  } else {
    // Guest user: Count from localStorage
    return getGuestWishlist().length;
  }
}

/**
 * Migrate guest wishlist to user account after login
 */
export async function migrateGuestWishlist(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user logged in, cannot migrate wishlist");
    return;
  }

  const guestWishlist = getGuestWishlist();

  if (guestWishlist.length === 0) {
    console.log("No guest wishlist to migrate");
    return;
  }

  console.log(
    `Migrating ${guestWishlist.length} items from guest wishlist to user account`
  );

  // Get existing wishlist items to avoid duplicates
  const { data: existingItems, error: fetchError } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id);

  if (fetchError) {
    console.error("Error fetching existing wishlist items:", fetchError);
    return;
  }

  type WishlistRow = { product_id: number };
  const existingWishlistRows: WishlistRow[] = (existingItems ??
    []) as unknown as WishlistRow[];
  const existingProductIds: number[] = existingWishlistRows.map(
    (item) => item.product_id
  );

  // Filter out products that are already in the user's wishlist
  const newProductIds = guestWishlist.filter(
    (id) => !existingProductIds.includes(id)
  );

  if (newProductIds.length === 0) {
    console.log("No new items to migrate");
    return;
  }

  // Prepare data for insertion
  const insertData = newProductIds.map((productId) => ({
    user_id: user.id,
    product_id: productId,
  }));

  // Insert new wishlist items
  const { error: insertError } = await supabase
    .from("wishlist")
    .insert(insertData);

  if (insertError) {
    console.error("Error migrating guest wishlist:", insertError);
    return;
  }

  // Clear guest wishlist after successful migration
  saveGuestWishlist([]);

  // Emit event to notify listeners
  wishlistEvents.emit("added");

  console.log(
    `Successfully migrated ${newProductIds.length} items to user wishlist`
  );
}
