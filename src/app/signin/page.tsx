"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import Logo from "@/components/Navbar/Logo";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("/");

  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect path from URL if available
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { success, error: signInError } = await signIn(email, password);

      if (success) {
        toast.success("Signed in successfully!");
        router.push(redirectPath);
      } else {
        setErrorMessage(signInError?.message || "Invalid email or password");
        toast.error(signInError?.message || "Invalid email or password");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(redirectPath);
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white m-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-2 flex justify-center"
          >
            {/* logo */}
            <Logo />
          </motion.div>
          {/* welcome back  TEXT*/}
          <motion.h2
            className="text-2xl font-bold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Welcome Back
          </motion.h2>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* sign in text */}
            <motion.div className="text-center" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
              <p className="mt-2 text-gray-600">
                Access your account to manage prescriptions
              </p>
            </motion.div>

            {errorMessage && (
              <motion.div
                className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                variants={itemVariants}
              >
                {errorMessage}
              </motion.div>
            )}

            <motion.form
              className="space-y-6"
              onSubmit={handleSubmit}
              variants={containerVariants}
            >
              {/* email and password input */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-6 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-all duration-200"
                    required
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>

                {/* password input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-6 border-gray-300 focus:border-blue-600 focus:ring-blue-600 transition-all duration-200"
                    required
                  />
                  {/* show password button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </motion.div>

              {/* remember me and forgot password */}
              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                    />
                    {/* remember me label */}
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                {/* forgot password */}
                <div className="text-sm">
                  <a
                    href="/forgetPassword"
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 py-6 text-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg group"
                >
                  {/* sign in button */}
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign in</span>
                      <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  )}
                </Button>
              </motion.div>

              <motion.div className="relative" variants={itemVariants}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={itemVariants}
              >
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.9 16.79 15.72 17.56V20.34H19.22C21.23 18.42 22.56 15.6 22.56 12.25Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23C14.97 23 17.46 22.02 19.22 20.34L15.72 17.56C14.74 18.23 13.47 18.64 12 18.64C9.11 18.64 6.69 16.69 5.81 14.09H2.17V16.96C3.92 20.56 7.61 23 12 23Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.81 14.09C5.6 13.44 5.47 12.74 5.47 12C5.47 11.26 5.6 10.56 5.81 9.91V7.04H2.17C1.46 8.55 1.05 10.22 1.05 12C1.05 13.78 1.46 15.45 2.17 16.96L5.81 14.09Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.36C13.59 5.36 15.04 5.91 16.17 6.97L19.28 3.87C17.46 2.17 14.97 1.05 12 1.05C7.61 1.05 3.92 3.49 2.17 7.09L5.81 9.96C6.69 7.36 9.11 5.36 12 5.36Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z" />
                  </svg>
                  Facebook
                </button>
              </motion.div>
            </motion.form>

            <motion.div
              className="text-center text-gray-500"
              variants={itemVariants}
            >
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-800 inline-flex items-center group transition-colors duration-200"
                >
                  <span>Sign up</span>
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-500">
          <p>© 2025 Your Pharmacy. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
