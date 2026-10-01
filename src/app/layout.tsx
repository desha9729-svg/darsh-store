import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "DRSH (درش) — More Than Just Accessories | E-Commerce Egypt",
  description:
    "Discover timeless, modern lifestyle accessories in Egypt. Minimalist watches, structured leather bags, titanium rings, and everyday essentials with Cash on Delivery across Egypt.",
  keywords: [
    "DRSH",
    "درش",
    "ساعات درش",
    "accessories egypt",
    "watches egypt",
    "cash on delivery",
    "leather bags",
    "minimalist accessories",
  ],
  openGraph: {
    title: "DRSH — More Than Just Accessories",
    description: "Egyptian fashion & everyday lifestyle accessories with Cash on Delivery.",
    url: "https://drsh-store.com",
    siteName: "DRSH",
    locale: "en_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F5F5F3] text-[#0B0B0B] antialiased">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
