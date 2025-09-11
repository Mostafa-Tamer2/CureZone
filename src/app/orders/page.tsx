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
  ChevronRight,
  ShoppingBag,
  Calendar,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserOrders, cancelOrder, Order } from "@/utilities/supabase/orders";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setLoadingOrders(true);
          const userOrders = await getUserOrders();
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast.error("Failed to load orders");
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Handle order cancellation
  const handleCancelOrder = async (orderId: number) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        const success = await cancelOrder(orderId);
        if (success) {
          // Update the orders list
          setOrders(
            orders.map((order) =>
              order.id === orderId ? { ...order, status: "cancelled" } : order
            )
          );
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
        };
      case "processing":
        return {
          icon: <Package className="w-5 h-5" />,
          color: "text-blue-500 bg-blue-50",
        };
      case "shipped":
        return {
          icon: <Truck className="w-5 h-5" />,
          color: "text-purple-500 bg-purple-50",
        };
      case "delivered":
        return {
          icon: <Check className="w-5 h-5" />,
          color: "text-green-500 bg-green-50",
        };
      case "cancelled":
        return {
          icon: <X className="w-5 h-5" />,
          color: "text-red-500 bg-red-50",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-gray-500 bg-gray-50",
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              You haven&apos;t placed any orders yet
            </p>
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Profile
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            <div className="text-sm text-gray-600">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {orders.map((order, index) => {
            const { icon, color } = getStatusDetails(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">Order #{order.id}</span>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${color}`}
                        >
                          {icon}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.order_date)}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {order.payment_method === "card"
                            ? "Credit Card"
                            : "Cash on Delivery"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-gray-500 text-sm">
                          Total Amount
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          ${order.total_amount.toFixed(2)}
                        </div>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-1"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {order.shipping_details
                      ? `Shipped to: ${order.shipping_details.fullName}`
                      : "Shipping details not available"}
                  </div>
                  {order.status === "pending" && (
                    <Button
                      variant="outline"
                      className="text-red-500 hover:bg-red-50 hover:border-red-200"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;
