"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/mock-products";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  Plus,
  ArrowUpRight,
  Filter,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory">("orders");

  // Sample orders list for admin review
  const [orders, setOrders] = useState([
    {
      id: "ord-1",
      orderNumber: "DRSH-10452",
      customer: "Mostafa Mahmoud",
      phone: "01098765432",
      governorate: "Kafr El Sheikh",
      itemsCount: 2,
      total: 1299,
      status: "pending_confirmation",
      date: "Today, 18:40",
      bostaTracking: "BST-10452-EGY",
    },
    {
      id: "ord-2",
      orderNumber: "DRSH-10451",
      customer: "Karim Adel",
      phone: "01234567890",
      governorate: "Cairo (Maadi)",
      itemsCount: 1,
      total: 899,
      status: "preparing",
      date: "Today, 14:15",
      bostaTracking: "BST-10451-EGY",
    },
    {
      id: "ord-3",
      orderNumber: "DRSH-10448",
      customer: "Nourhan Samy",
      phone: "01122334455",
      governorate: "Giza (Dokki)",
      itemsCount: 1,
      total: 1450,
      status: "shipped",
      date: "Yesterday",
      bostaTracking: "BST-10448-EGY",
    },
    {
      id: "ord-4",
      orderNumber: "DRSH-10440",
      customer: "Tarek Youssef",
      phone: "01001122334",
      governorate: "Alexandria",
      itemsCount: 3,
      total: 2149,
      status: "delivered",
      date: "2 days ago",
      bostaTracking: "BST-10440-EGY",
    },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Inventory rows flattened from variants
  const inventoryItems = PRODUCTS.flatMap((p) =>
    p.variants.map((v) => ({
      productName: p.name,
      sku: v.sku,
      title: v.title,
      price: v.price,
      stock: v.stockQuantity,
      isLow: v.stockQuantity <= 3 && v.stockQuantity > 0,
      isOut: v.stockQuantity === 0,
    }))
  );

  const lowStockCount = inventoryItems.filter((i) => i.isLow || i.isOut).length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-neutral-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
                DRSH Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0B] uppercase tracking-tight mt-1">
              Admin Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white border border-neutral-300 text-xs font-bold uppercase rounded-sm hover:border-black flex items-center gap-1.5 transition-colors"
            >
              <span>View Live Store</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-white p-5 rounded-sm border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Total COD Orders</span>
              <Package className="w-4 h-4 text-black" />
            </div>
            <span className="text-2xl font-black text-black">{orders.length}</span>
            <span className="text-[10px] text-green-700 block mt-1 font-semibold">
              All handled via Cash on Delivery
            </span>
          </div>

          <div className="bg-white p-5 rounded-sm border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Pending Confirmation</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-black text-amber-700">
              {orders.filter((o) => o.status === "pending_confirmation").length}
            </span>
            <span className="text-[10px] text-neutral-500 block mt-1">
              Awaiting phone verification
            </span>
          </div>

          <div className="bg-white p-5 rounded-sm border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Active Revenue</span>
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <span className="text-2xl font-black text-black">{formatPrice(totalRevenue)}</span>
            <span className="text-[10px] text-[#686B6B] block mt-1">COD gross pipeline</span>
          </div>

          <div className="bg-white p-5 rounded-sm border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Low Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-2xl font-black text-red-600">{lowStockCount}</span>
            <span className="text-[10px] text-red-700 block mt-1 font-medium">
              Variants requiring reorder
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 pb-3">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === "orders"
                ? "bg-[#0B0B0B] text-white"
                : "bg-white text-neutral-600 hover:text-black"
            }`}
          >
            Orders Pipeline ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === "inventory"
                ? "bg-[#0B0B0B] text-white"
                : "bg-white text-neutral-600 hover:text-black"
            }`}
          >
            Inventory Matrix ({inventoryItems.length} SKUs)
          </button>
        </div>

        {/* Tab 1: Orders Pipeline Table */}
        {activeTab === "orders" && (
          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-xs">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Recent Customer Orders
              </span>
              <span className="text-xs text-[#686B6B]">Fulfillment: Bosta Carrier</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F5F3] text-neutral-600 uppercase tracking-wider font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer & Phone</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Bosta Waybill</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-black">{o.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-semibold text-black block">{o.customer}</span>
                        <a href={`tel:${o.phone}`} className="text-neutral-500 hover:underline">
                          {o.phone}
                        </a>
                      </td>
                      <td className="p-4 text-neutral-600">{o.governorate}</td>
                      <td className="p-4 font-bold text-black">{formatPrice(o.total)}</td>
                      <td className="p-4">
                        {o.status === "pending_confirmation" && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xs font-semibold">
                            Pending Review
                          </span>
                        )}
                        {o.status === "preparing" && (
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xs font-semibold">
                            Preparing
                          </span>
                        )}
                        {o.status === "shipped" && (
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xs font-semibold">
                            Shipped (Bosta)
                          </span>
                        )}
                        {o.status === "delivered" && (
                          <span className="px-2.5 py-1 bg-green-50 text-green-800 border border-green-200 rounded-xs font-semibold">
                            Delivered & Paid
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-neutral-500 text-[11px]">{o.bostaTracking}</td>
                      <td className="p-4 text-right space-x-2">
                        {o.status === "pending_confirmation" && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "preparing")}
                            className="px-2.5 py-1 bg-[#0B0B0B] text-white text-[11px] font-bold rounded-xs hover:bg-neutral-800"
                          >
                            Confirm
                          </button>
                        )}
                        {o.status === "preparing" && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "shipped")}
                            className="px-2.5 py-1 bg-purple-900 text-white text-[11px] font-bold rounded-xs hover:bg-purple-800"
                          >
                            Create Bosta Waybill
                          </button>
                        )}
                        {o.status === "shipped" && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "delivered")}
                            className="px-2.5 py-1 bg-green-800 text-white text-[11px] font-bold rounded-xs hover:bg-green-700"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory Matrix Table */}
        {activeTab === "inventory" && (
          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-xs">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Stock & Variant Matrix
              </span>
              <span className="text-xs text-neutral-500">Live Inventory Counts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F5F3] text-neutral-600 uppercase tracking-wider font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Variant Specification</th>
                    <th className="p-4">Unit Price</th>
                    <th className="p-4">Stock Quantity</th>
                    <th className="p-4">Inventory Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {inventoryItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-semibold text-black">{item.productName}</td>
                      <td className="p-4 font-mono text-neutral-500">{item.sku}</td>
                      <td className="p-4 text-neutral-700">{item.title}</td>
                      <td className="p-4 font-bold text-black">{formatPrice(item.price)}</td>
                      <td className="p-4 font-bold text-black">{item.stock}</td>
                      <td className="p-4">
                        {item.isOut ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-xs uppercase">
                            Out of Stock
                          </span>
                        ) : item.isLow ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-xs uppercase">
                            Low Stock (Critical)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-xs uppercase">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
