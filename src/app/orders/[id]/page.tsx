"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  Check,
  Truck,
  X,
  ArrowLeft,
  Calendar,
  CreditCard,
  Home,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  getOrderDetails,
  cancelOrder,
  Order,
} from "@/utilities/supabase/orders";
import toast from "react-hot-toast";

export default function OrderDetailsPage({params,}: {params: { id: string };}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const orderId = parseInt(params.id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (user && orderId) {
        try {
          setLoadingOrder(true);
          const orderData = await getOrderDetails(orderId);
          if (orderData) {
            setOrder(orderData);
          } else {
            // Order not found or doesn't belong to user
            toast.error("Order not found");
            router.push("/orders");
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error("Failed to load order details");
        } finally {
          setLoadingOrder(false);
        }
      }
    };

    if (user && !isNaN(orderId)) {
      fetchOrderDetails();
    }
  }, [user, orderId, router]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (order && confirm("Are you sure you want to cancel this order?")) {
      try {
        const success = await cancelOrder(order.id);
        if (success) {
          setOrder({ ...order, status: "cancelled" });
          toast.success("Order cancelled successfully");
        } else {
          toast.error("Failed to cancel order");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error("An error occurred while cancelling the order");
      }
    }
  };

  // Get status icon and color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-yellow-500 bg-yellow-50",
          text: "Your order has been received and is being processed.",
        };
      case "processing":
        return {
          icon: <Package className="w-5 h-5" />,
          color: "text-blue-500 bg-blue-50",
          text: "Your order is being prepared for shipping.",
        };
      case "shipped":
        return {
          icon: <Truck className="w-5 h-5" />,
          color: "text-purple-500 bg-purple-50",
          text: "Your order is on its way to you.",
        };
      case "delivered":
        return {
          icon: <Check className="w-5 h-5" />,
          color: "text-green-500 bg-green-50",
          text: "Your order has been delivered.",
        };
      case "cancelled":
        return {
          icon: <X className="w-5 h-5" />,
          color: "text-red-500 bg-red-50",
          text: "This order has been cancelled.",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-gray-500 bg-gray-50",
          text: "Order status is unknown.",
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading || loadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Order not found
            </h2>
            <p className="text-gray-600 mb-8">
              We couldn&apos;t find the order you&apos;re looking for
            </p>
            <Link href="/orders">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { icon, color, text } = getStatusDetails(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/orders"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Orders
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
            <div className="text-sm text-gray-600">Order #{order.id}</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${color}`}
                >
                  {icon}
                  <span className="ml-1 capitalize">{order.status}</span>
                </div>
                <span className="text-gray-500">{text}</span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Ordered: {formatDate(order.order_date)}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  <span>
                    Payment:{" "}
                    {order.payment_method === "card"
                      ? "Credit Card"
                      : "Cash on Delivery"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Items
              </h2>
              <div className="space-y-6">
                {order.items &&
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        {item.product?.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product?.name || "Product"}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.product?.name || "Product"}
                        </h3>
                        {item.product?.category && (
                          <p className="text-sm text-gray-500">
                            {item.product.category.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${(order.total_amount * 0.92).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${(order.total_amount * 0.03).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(order.total_amount * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">
                  Shipping Details
                </h3>
                {order.shipping_details ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-1">
                        <Home className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-800">
                          {order.shipping_details.fullName}
                        </p>
                        <p>{order.shipping_details.address}</p>
                        <p>
                          {order.shipping_details.city},{" "}
                          {order.shipping_details.state}{" "}
                          {order.shipping_details.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {order.shipping_details.phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {order.shipping_details.email}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Shipping details not available
                  </p>
                )}
              </div>

              {/* Cancel button for pending orders */}
              {order.status === "pending" && (
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:bg-red-50 hover:border-red-200"
                    onClick={handleCancelOrder}
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
