import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Navbar/Header";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/lib/auth-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/components/ui/toast-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
//Meta Data Configurations
export const metadata: Metadata = {
  title: "CureZone",
  description:
    "CureZone Pharmacy is online store , your one stop for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ToastProvider />
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
