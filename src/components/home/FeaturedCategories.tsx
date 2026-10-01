import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/mock-products";
import { ArrowUpRight } from "lucide-react";

export function FeaturedCategories() {
  return (
    <section className="py-20 bg-[#F5F5F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
              Discover By Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0B] tracking-tight mt-1">
              Curated Collections
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-wider text-[#0B0B0B] hover:text-[#686B6B] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative bg-white border border-neutral-200/80 rounded-sm overflow-hidden flex flex-col p-3 transition-all duration-300 hover:shadow-md hover:border-neutral-400"
            >
              <div className="relative aspect-square w-full bg-neutral-100 rounded-xs overflow-hidden mb-3">
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              <div className="text-center">
                <h3 className="text-xs font-bold text-[#0B0B0B] uppercase tracking-wider group-hover:text-[#686B6B] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-[#686B6B] mt-0.5 block">
                  {cat.itemCount} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
