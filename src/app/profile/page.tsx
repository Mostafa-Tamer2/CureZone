"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  UserCircle,
  Mail,
  Calendar,
  LogOut,
  Phone,
  MapPin,
  Edit,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/utilities/supabase/client";
import Link from "next/link";

// Define the structure for the user profile data
type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  // Fetch user profile from the users table
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoadingProfile(true);
          const { data, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
          } else {
            setProfile(data as UserProfile);
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (isLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-8 sm:px-10">
            <div className="flex flex-col items-center sm:flex-row sm:justify-between">
              <div className="flex flex-col items-center sm:items-start text-white">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="mt-1 text-blue-100">
                  Manage your account information
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link href="/profile/edit">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Profile info */}
          <div className="px-6 py-8 sm:px-10">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <UserCircle size={64} />
                </div>
              </div>

              {/* User info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.full_name ||
                      user.user_metadata?.full_name ||
                      "User"}
                  </h2>
                </div>

                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile?.email || user.email}
                    </dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Member since
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                    </dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile?.phone || "Not provided"}
                    </dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile?.address || "Not provided"}
                    </dd>
                  </div>
                </dl>

                <div className="pt-4 flex gap-3">
                  <Link href="/orders">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
