"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Completely isolate admin dashboard from the storefront layout
  if (isAdmin) {
    return <main className="min-h-screen bg-[#0F172A] text-white" dir="rtl">{children}</main>;
  }

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
