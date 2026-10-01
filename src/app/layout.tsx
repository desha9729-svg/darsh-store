import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";
import { CartProvider } from "@/context/cart-context";
import { StoreLayout } from "@/components/layout/StoreLayout";

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
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col bg-[#F5F5F3] text-[#0B0B0B] antialiased">
        <LanguageProvider>
          <CartProvider>
            <StoreLayout>{children}</StoreLayout>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
