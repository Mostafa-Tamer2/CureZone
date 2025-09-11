"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { UserCircle, Mail, ChevronLeft } from "lucide-react";
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

export default function EditProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to load profile");
          } else if (data) {
            setProfile(data as UserProfile);
            setFullName(
              typeof data.full_name === "string" && data.full_name.trim()
                ? data.full_name
                : ""
            );
            setPhone(
              typeof data.phone === "string" && data.phone.trim()
                ? data.phone
                : ""
            );
            setAddress(
              typeof data.address === "string" && data.address.trim()
                ? data.address
                : ""
            );
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          phone,
          address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
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
                <h1 className="text-2xl font-bold">Edit Profile</h1>
                <p className="mt-1 text-blue-100">
                  Update your personal information
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="px-6 py-8 sm:px-10">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <UserCircle size={64} />
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Email (read-only) */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || user.email || ""}
                        disabled
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Address
                      </label>
                      <Input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <Link href="/profile">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>
                    </Link>

                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
