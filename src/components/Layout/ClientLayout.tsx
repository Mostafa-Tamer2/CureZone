"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Navbar/Header";
import Footer from "@/components/Footer/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignInPage = pathname === "/signin";

  return (
    <>
      {!isSignInPage && <Header />}
      {children}
      {!isSignInPage && <Footer />}
    </>
  );
}
