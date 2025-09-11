"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import {
  Lock,
  ArrowLeft,
  Check,
  CreditCard,
  Shield,
  Truck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utilities/supabase/client";

// Types for form data
interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Create a unique session ID for this checkout
  const [checkoutSessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );

  // Store order summary for after cart is cleared
  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    items: typeof cartItems;
  } | null>(null);

  // Form states
  type CheckoutStep = "shipping" | "payment" | "confirmation";
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [forceShowConfirmation, setForceShowConfirmation] = useState(false);

  // Form data
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // Calculate order summary
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/signin?redirect=/checkout");
    }
  }, [user, router]);

  // Load user data if logged in
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Get user profile data from the database
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          if (data) {
            // Check for previous orders to get shipping data
            const { data: orderData } = await supabase
              .from("orders")
              .select("shipping_details")
              .eq("user_id", user.id)
              .order("order_date", { ascending: false })
              .limit(1)
              .single();

            // If we have previous order data with shipping details, use it
            if (orderData && orderData.shipping_details) {
              const savedAddress =
                orderData.shipping_details as Partial<ShippingDetails>;
              setShippingDetails((prev) => ({
                ...prev,
                fullName:
                  typeof data.full_name === "string" && data.full_name.trim()
                    ? data.full_name
                    : prev.fullName,
                email:
                  typeof data.email === "string" && data.email.trim()
                    ? data.email
                    : prev.email,
                phone:
                  typeof data.phone === "string" && data.phone.trim()
                    ? data.phone
                    : prev.phone,
                address:
                  savedAddress &&
                  typeof savedAddress.address === "string" &&
                  savedAddress.address.trim()
                    ? savedAddress.address
                    : typeof data.address === "string" && data.address.trim()
                    ? data.address
                    : prev.address,
                city:
                  savedAddress &&
                  typeof savedAddress.city === "string" &&
                  savedAddress.city.trim()
                    ? savedAddress.city
                    : prev.city,
                state:
                  savedAddress &&
                  typeof savedAddress.state === "string" &&
                  savedAddress.state.trim()
                    ? savedAddress.state
                    : prev.state,
                zipCode:
                  savedAddress &&
                  typeof savedAddress.zipCode === "string" &&
                  savedAddress.zipCode.trim()
                    ? savedAddress.zipCode
                    : prev.zipCode,
              }));
            } else {
              // Otherwise just use the user profile data
              setShippingDetails((prev) => ({
                ...prev,
                fullName:
                  typeof data.full_name === "string" && data.full_name.trim()
                    ? data.full_name
                    : prev.fullName,
                email:
                  typeof data.email === "string" && data.email.trim()
                    ? data.email
                    : prev.email,
                phone:
                  typeof data.phone === "string" && data.phone.trim()
                    ? data.phone
                    : prev.phone,
                address:
                  typeof data.address === "string" && data.address.trim()
                    ? data.address
                    : prev.address,
              }));
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          // Still set the basic data from the user object even if we can't get the full profile
          if (user.user_metadata) {
            setShippingDetails((prev) => ({
              ...prev,
              fullName:
                typeof user.user_metadata.full_name === "string" &&
                user.user_metadata.full_name.trim()
                  ? user.user_metadata.full_name
                  : prev.fullName,
              email:
                typeof user.email === "string" && user.email.trim()
                  ? user.email
                  : prev.email,
            }));
          }
        }
      }
    };

    loadUserData();
  }, [user]);

  // Check for completed checkout on initial load
  useEffect(() => {
    // Check if we have a completed checkout in localStorage
    const completedCheckout = localStorage.getItem("checkoutCompleted");
    if (completedCheckout === checkoutSessionId) {
      console.log("Found completed checkout in localStorage");

      // Also try to restore the order summary from localStorage
      const savedOrderSummary = localStorage.getItem("orderSummary");
      if (savedOrderSummary) {
        try {
          const parsedSummary = JSON.parse(savedOrderSummary);
          setOrderSummary({
            ...parsedSummary,
            items: [],
          });
        } catch (e) {
          console.error("Error parsing saved order summary", e);
        }
      }

      setForceShowConfirmation(true);
      setOrderCompleted(true);
    }
  }, [checkoutSessionId]);

  // Ensure confirmation screen appears when orderCompleted is true
  useEffect(() => {
    if (orderCompleted) {
      console.log("Order completed, setting step to confirmation");
      setForceShowConfirmation(true);
    }
  }, [orderCompleted]);

  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          total_amount: total,
          status: "pending",
          payment_method: paymentMethod,
          shipping_details: shippingDetails,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Save the order summary before clearing the cart
      setOrderSummary({
        subtotal,
        shipping,
        tax,
        total,
        items: [...cartItems], // Create a copy of the cart items
      });

      // Store the order summary in localStorage too
      localStorage.setItem(
        "orderSummary",
        JSON.stringify({
          subtotal,
          shipping,
          tax,
          total,
          itemCount: cartItems.length,
        })
      );

      // Set the force show confirmation flag and mark order as completed
      // This will bypass any state issues and force the confirmation screen
      setForceShowConfirmation(true);
      setOrderCompleted(true);

      // Save to localStorage as a backup to ensure confirmation persists through reloads
      localStorage.setItem("checkoutCompleted", checkoutSessionId);
      console.log("Order completed, showing confirmation screen");

      // Then clear the cart after a delay to avoid redirection issues
      setTimeout(async () => {
        await clearCart();
        console.log("Cart cleared after confirmation screen is shown");
      }, 1000);
    } catch (error) {
      console.error("Error creating order:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process your order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes for shipping form
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for payment form
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      // Format card number with spaces
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);

      setPaymentDetails((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "expiryDate") {
      // Format expiry date with slash
      const formatted = value
        .replace(/\//g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);

      setPaymentDetails((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setPaymentDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Always render confirmation screen if order is completed or forced to show
  if (orderCompleted || forceShowConfirmation) {
    console.log("Rendering confirmation screen because orderCompleted is true");
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. We&apos;ve received your order and
              will process it shortly.
            </p>
            <div className="p-6 bg-gray-50 rounded-xl mb-8">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>
                    $
                    {orderSummary
                      ? orderSummary.subtotal.toFixed(2)
                      : subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {orderSummary
                      ? orderSummary.shipping === 0
                        ? "Free"
                        : `$${orderSummary.shipping.toFixed(2)}`
                      : shipping === 0
                      ? "Free"
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>
                    $
                    {orderSummary
                      ? orderSummary.tax.toFixed(2)
                      : tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="capitalize">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Credit/Debit Card"}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      $
                      {orderSummary
                        ? orderSummary.total.toFixed(2)
                        : total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Return to Home
                </Button>
              </Link>
              <Link href="/shop">
                <Button className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // (The one that checks orderCompleted || forceShowConfirmation)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to cart
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            <div className="flex items-center text-green-600">
              <Lock className="w-4 h-4 mr-1" />
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-6">
              <div
                className={`flex items-center ${
                  step === "shipping"
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "shipping" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  1
                </div>
                <span className="ml-2">Shipping</span>
              </div>
              <div className="w-16 h-1 mx-2 bg-gray-200"></div>
              <div
                className={`flex items-center ${
                  step === "payment"
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "payment" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  2
                </div>
                <span className="ml-2">Payment</span>
              </div>
              <div className="w-16 h-1 mx-2 bg-gray-200"></div>
              <div
                className={`flex items-center ${
                  step === "confirmation"
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "confirmation" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  3
                </div>
                <span className="ml-2">Confirmation</span>
              </div>
            </div>

            {/* Shipping Details Form */}
            {step === "shipping" && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Shipping Information
                </h2>

                {user ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="text-blue-500 mt-1 mr-3">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-800 font-medium">
                          Personal Information
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          We&apos;ve prefilled some information from your
                          account. Please review and update if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={shippingDetails.fullName}
                        onChange={handleShippingChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                          shippingDetails.fullName
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                      />
                      {shippingDetails.fullName && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Using your saved name
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingDetails.email}
                        onChange={handleShippingChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                          shippingDetails.email
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                      />
                      {shippingDetails.email && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Using your saved email
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="phone"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={handleShippingChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                          shippingDetails.phone
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                      />
                      {shippingDetails.phone && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Using your saved phone
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="address"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingDetails.address}
                        onChange={handleShippingChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                          shippingDetails.address
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                      />
                      {shippingDetails.address && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Using your saved address
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="city"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="state"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="zipCode"
                      >
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingDetails.zipCode}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="country"
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={shippingDetails.country}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button type="submit" className="px-8">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Form */}
            {step === "payment" && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Payment Information
                </h2>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handlePaymentSubmit}>
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                          paymentMethod === "card"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            paymentMethod === "card"
                              ? "border-blue-500"
                              : "border-gray-400"
                          }`}
                        >
                          {paymentMethod === "card" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                      </div>

                      <div
                        className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            paymentMethod === "cod"
                              ? "border-blue-500"
                              : "border-gray-400"
                          }`}
                        >
                          {paymentMethod === "cod" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Truck className="w-5 h-5 mr-2 text-gray-600" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Payment Fields (only shown when card payment method is selected) */}
                  {paymentMethod === "card" ? (
                    <div className="space-y-6">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="cardNumber"
                        >
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder="xxxx xxxx xxxx xxxx"
                            maxLength={19}
                            required={paymentMethod === "card"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <CreditCard className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="cardHolder"
                        >
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={paymentDetails.cardHolder}
                          onChange={handlePaymentChange}
                          required={paymentMethod === "card"}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="expiryDate"
                          >
                            Expiry Date (MM/YY)
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentDetails.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required={paymentMethod === "card"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="cvv"
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            maxLength={3}
                            required={paymentMethod === "card"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* COD Information */
                    <div className="p-4 bg-gray-50 rounded-lg mb-6">
                      <div className="flex items-start">
                        <div className="text-blue-500 mt-1 mr-3">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-gray-800 font-medium">
                            Cash on Delivery Information
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            You will pay for your order when it is delivered to
                            your address. Please have the exact amount ready.
                            Our delivery person will provide a receipt.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("shipping")}
                    >
                      Back to Shipping
                    </Button>
                    <Button type="submit" className="px-8" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center">
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
                          Processing...
                        </span>
                      ) : (
                        "Complete Order"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    <span>Encrypted Data</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4"
                  >
                    <div className="relative overflow-hidden rounded-lg w-16 h-16">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        EGP {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>EGP {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    <span>Shipping</span>
                  </div>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>EGP {tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>EGP {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Policy */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="flex items-center mb-2">
                  <Truck className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Shipping Policy</span>
                </p>
                <p>
                  Free shipping on orders over $100. Standard delivery: 3-5
                  business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
