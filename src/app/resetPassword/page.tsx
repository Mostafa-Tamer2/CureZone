"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/utilities/supabase/client";
import { updateUserPassword } from "@/utilities/supabase/user";
import { useAuth } from "@/lib/auth-context";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  //   useEffect(() => {
  //     if (!user) {
  //       router.push("/signin");
  //     }
  //   }, [user, router]);

  useEffect(() => {
    // Exchange the token from the link once
    supabase.auth.exchangeCodeForSession(window.location.href);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await updateUserPassword(newPassword);
      toast.success("Password reset successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Password reset failed.");
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div className="bg-white shadow-2xl p-8 rounded-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6">Set a New Password</h2>

        {/* New Password Field */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded-xl pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-cPink hoverEffect"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-6">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded-xl pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-cPink hoverEffect"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="bg-cPink text-black px-6 py-2 rounded-xl font-semibold hover:bg-cBlack hover:text-cPink hoverEffect"
        >
          Update Password
        </button>
      </div>
    </form>
  );
}
