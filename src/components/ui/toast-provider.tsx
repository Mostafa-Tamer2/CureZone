"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: "#ffffff",
          color: "#333333",
          border: "1px solid #e2e8f0",
          borderRadius: "0.5rem",
          padding: "1rem",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        success: {
          style: {
            borderLeft: "4px solid #10b981",
          },
        },
        error: {
          style: {
            borderLeft: "4px solid #ef4444",
          },
        },
      }}
    />
  );
}
