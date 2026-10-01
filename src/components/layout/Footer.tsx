import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Clock, RefreshCw } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B0B0B] text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-neutral-800">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cash on Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Pay when your order arrives at your doorstep across Egypt.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Truck className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bosta Express Shipping</h4>
              <p className="text-xs text-neutral-400 mt-1">Reliable nationwide coverage with SMS & live status tracking.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RefreshCw className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Easy Inspection</h4>
              <p className="text-xs text-neutral-400 mt-1">Inspect your items upon courier arrival before payment.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="w-6 h-6 text-[#D9C9B3] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Dedicated Support</h4>
              <p className="text-xs text-neutral-400 mt-1">Direct assistance via phone, WhatsApp & email.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#D9C9B3] text-[#0B0B0B] rounded-sm flex items-center justify-center font-extrabold text-lg">
                D
              </div>
              <span className="font-extrabold text-2xl tracking-widest text-white">DRSH</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              MORE THAN JUST ACCESSORIES. Curated Egyptian fashion & everyday lifestyle accessories designed with architectural precision and accessible luxury.
            </p>
            <p className="text-xs text-[#D9C9B3] font-medium tracking-wide">
              درش — قطع تكمل إطلالتك وتبرز تفاصيل أسلوبك.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link href="/shop?category=watches" className="hover:text-white transition-colors">Watches</Link></li>
              <li><Link href="/shop?category=bags" className="hover:text-white transition-colors">Bags & Leather</Link></li>
              <li><Link href="/shop?category=jewelry" className="hover:text-white transition-colors">Jewelry & Rings</Link></li>
              <li><Link href="/shop?category=eyewear" className="hover:text-white transition-colors">Eyewear</Link></li>
              <li><Link href="/shop?category=wallets" className="hover:text-white transition-colors">Wallets</Link></li>
              <li><Link href="/shop?category=perfumes" className="hover:text-white transition-colors">Fragrances</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Governorates</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* About & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">About & Legal</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About DRSH</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/admin" className="text-neutral-500 hover:text-neutral-400 text-xs">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Egypt Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} DRSH (درش) Store. All rights reserved. Made in Egypt.</p>
          <div className="flex items-center space-x-4 text-neutral-400">
            <span>Cash on Delivery (COD)</span>
            <span>•</span>
            <span>Bosta Logistics</span>
            <span>•</span>
            <span>Cairo / Egypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
