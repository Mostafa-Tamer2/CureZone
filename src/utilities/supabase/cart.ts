import { supabase } from "./client";
import type { Product, Category } from "@/types/product";

// Define the cart item type
export interface CartItem {
  product: Product;
  quantity: number;
}

// event system for cart changes
type CartEventType = "added" | "removed" | "updated" | "cleared";

type CartEventListener = () => void;

class CartEventEmitter {
  private listeners: Record<CartEventType, CartEventListener[]> = {
    added: [],
    removed: [],
    updated: [],
    cleared: [],
  };

  addEventListener(event: CartEventType, callback: CartEventListener) {
    this.listeners[event].push(callback);

    // Return an unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      );
    };
  }

  emit(event: CartEventType) {
    this.listeners[event].forEach((callback) => callback());
  }
}

export const cartEvents = new CartEventEmitter();

// Local storage key for guest users' cart
const GUEST_CART_KEY = "curezone_guest_cart";

/**
 * Gets the guest cart from localStorage
 */
function getGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const storedCart = localStorage.getItem(GUEST_CART_KEY);
  if (!storedCart) return [];

  try {
    return JSON.parse(storedCart);
  } catch (e) {
    console.error("Error parsing guest cart:", e);
    return [];
  }
}

/**
 * Saves the guest cart to localStorage
 */
function saveGuestCart(cartItems: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
}

/**
 * Add a product to the user's cart
 */
export async function addToCart(product: Product, quantity: number = 1) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Add to database
    // Check if product is already in cart
    const { data: existingItem } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single<{ id: number; quantity: number }>();

    if (existingItem) {
      // Update quantity if item already exists
      const { error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (error) {
        console.error("Error updating cart quantity:", error);
        return { success: false, error };
      }
    } else {
      // Add new item to cart
      const { error } = await supabase.from("cart").insert({
        user_id: user.id,
        product_id: product.id,
        quantity,
      });

      if (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error };
      }
    }
  } else {
    // Guest user: Add to localStorage
    const guestCart = getGuestCart();

    // Check if product is already in guest cart
    const existingItemIndex = guestCart.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      guestCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      guestCart.push({ product, quantity });
    }

    saveGuestCart(guestCart);
  }

  // Emit event to notify listeners
  cartEvents.emit("added");

  return { success: true };
}

/**
 * Remove a product from the user's cart
 */
export async function removeFromCart(productId: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Remove from database
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing from cart:", error);
      return { success: false, error };
    }
  } else {
    // Guest user: Remove from localStorage
    const guestCart = getGuestCart();
    const updatedCart = guestCart.filter(
      (item) => item.product.id !== productId
    );
    saveGuestCart(updatedCart);
  }

  // Emit event to notify listeners
  cartEvents.emit("removed");

  return { success: true };
}

/**
 * Update the quantity of a product in the cart
 */
export async function updateCartItemQuantity(
  productId: number,
  quantity: number
) {
  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Update in database
    const { error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      console.error("Error updating cart quantity:", error);
      return { success: false, error };
    }
  } else {
    // Guest user: Update in localStorage
    const guestCart = getGuestCart();
    const itemIndex = guestCart.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex !== -1) {
      guestCart[itemIndex].quantity = quantity;
      saveGuestCart(guestCart);
    }
  }

  // Emit event to notify listeners
  cartEvents.emit("updated");

  return { success: true };
}

/**
 * Clear the entire cart
 */
export async function clearCart() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Clear from database
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error };
    }
  } else {
    // Guest user: Clear localStorage
    saveGuestCart([]);
  }

  // Emit event to notify listeners
  cartEvents.emit("cleared");

  return { success: true };
}

/**
 * Get all items in the user's cart
 */
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Logged-in user: Get from database
      // First, get the cart items with their quantities
      const { data: cartItems, error } = await supabase
        .from("cart")
        .select("product_id, quantity")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cart:", error);
        return [];
      }

      if (!cartItems || cartItems.length === 0) {
        return [];
      }

      // Get the product details for all cart items
      type CartRow = { product_id: number; quantity: number };
      const cartRows: CartRow[] = (cartItems as unknown as CartRow[]) ?? [];

      const productIds = cartRows.map((item) => item.product_id);
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*, categories(*)")
        .in("id", productIds);

      if (productsError) {
        console.error("Error fetching cart products:", productsError);
        return [];
      }

      // Combine the cart items with their product details
      type ProductRow = {
        id: number;
        name: string;
        image_url: string;
        description: string;
        price: number;
        stock_quantity: number;
        status: string;
        discount_percent: number | null;
        category_id: number;
        categories: Category;
      };

      const productRows: ProductRow[] =
        (products as unknown as ProductRow[]) ?? [];

      const combined: CartItem[] = cartRows
        .map((cartItem) => {
          const prod: ProductRow | undefined = productRows.find(
            (p) => p.id === cartItem.product_id
          );
          if (!prod) {
            return null;
          }

          const product: Product = {
            id: prod.id,
            name: prod.name,
            image_url: prod.image_url,
            description: prod.description,
            price: prod.price,
            stock_quantity: prod.stock_quantity,
            status: prod.status,
            discount_percent: prod.discount_percent,
            category_id: prod.category_id,
            category: prod.categories,
          };

          return {
            product,
            quantity: Number(cartItem.quantity) || 0,
          } as CartItem;
        })
        .filter((v): v is CartItem => v !== null);

      return combined;
    } else {
      // Guest user: Get from localStorage
      return getGuestCart();
    }
  } catch (err) {
    console.error("Unexpected error in getCartItems:", err);
    return [];
  }
}

/**
 * Check if a product is in the cart
 */
export async function isInCart(productId: number): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Check in database
    const { data, error } = await supabase
      .from("cart")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking if product is in cart:", error);
    }

    return !!data;
  } else {
    // Guest user: Check in localStorage
    const guestCart = getGuestCart();
    return guestCart.some((item) => item.product.id === productId);
  }
}

/**
 * Get the quantity of a specific cart item
 */
export async function getCartItemQuantity(productId: number): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Get from database
    const { data, error } = await supabase
      .from("cart")
      .select("quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single<{ quantity: number }>();

    if (error && error.code !== "PGRST116") {
      console.error("Error getting cart item quantity:", error);
    }

    return typeof data?.quantity === "number" ? data.quantity : 0;
  } else {
    // Guest user: Get from localStorage
    const guestCart = getGuestCart();
    const item = guestCart.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  }
}

/**
 * Get the total number of items in the cart
 */
export async function getCartCount(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Logged-in user: Calculate from database
    const { data, error } = await supabase
      .from("cart")
      .select("quantity")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }

    const rows: { quantity: number }[] =
      (data as unknown as {
        quantity: number;
      }[]) ?? [];
    return rows.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0
    );
  } else {
    // Guest user: Calculate from localStorage
    const guestCart = getGuestCart();
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  }
}

/**
 * Migrate guest cart to user cart after login
 */
export async function migrateGuestCart(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return; // No logged-in user

  const guestCart = getGuestCart();
  if (guestCart.length === 0) return; // No guest cart to migrate

  // For each item in the guest cart
  for (const item of guestCart) {
    // Check if the product already exists in the user's cart
    const { data: existingItem } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", item.product.id)
      .single<{ id: number; quantity: number }>();

    if (existingItem) {
      // Update quantity if item already exists
      await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + item.quantity })
        .eq("id", existingItem.id);
    } else {
      // Add new item to user's cart
      await supabase.from("cart").insert({
        user_id: user.id,
        product_id: item.product.id,
        quantity: item.quantity,
      });
    }
  }

  // Clear the guest cart after migration
  saveGuestCart([]);

  // Emit event to notify listeners
  cartEvents.emit("updated");
}
