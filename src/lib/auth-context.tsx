"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utilities/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { migrateGuestWishlist } from "@/utilities/supabase/wishlist";
import { migrateGuestCart, cartEvents } from "@/utilities/supabase/cart";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    options?: { fullName?: string }
  ) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  signInWithGoogle: (redirectPath?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session on initial load
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // If a user just signed up or signed in, ensure they exist in the users table
      if (session?.user && event === "SIGNED_IN") {
        await ensureUserInDatabase(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Ensure user exists in custom users table
  const ensureUserInDatabase = async (user: User) => {
    try {
      // Check if user already exists in custom table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        // Insert user into custom users table
        const { error } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Error inserting user into custom table:", error);
        }
      }
    } catch (error) {
      console.error("Error ensuring user in database:", error);
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    options?: { fullName?: string }
  ) => {
    try {
      // Create user in Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options?.fullName || "",
          },
        },
      });

      if (error) throw error;

      // If user was created successfully and we have user data
      if (data.user) {
        // Insert user into custom users table
        await ensureUserInDatabase(data.user);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, error: error as Error };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // After successful sign in, migrate any guest wishlist and cart items
      await migrateGuestWishlist();
      await migrateGuestCart();

      // Trigger cart update
      cartEvents.emit("updated");

      return { success: true, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error: error as Error };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (redirectPath?: string) => {
    try {
      const redirectUrl = new URL(`${window.location.origin}/auth/callback`);

      // Add the redirect path as a query parameter if provided
      if (redirectPath) {
        redirectUrl.searchParams.append("redirect_to", redirectPath);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl.toString(),
        },
      });

      return !error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return false;
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    // Emit cart updated event after logout to refresh the cart UI
    cartEvents.emit("updated");
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
