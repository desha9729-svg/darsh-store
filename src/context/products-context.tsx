"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/ecommerce";
import {
  getStoredProducts,
  saveStoredProducts,
  resetStoredProducts,
} from "@/lib/products-store";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/data/mock-products";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateStock: (sku: string, newStock: number) => void;
  resetToDefaults: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setProducts(getStoredProducts());
    setIsInitialized(true);

    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener("drsh-products-updated", handleUpdate);
    return () => window.removeEventListener("drsh-products-updated", handleUpdate);
  }, []);

  const addProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const deleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const updateStock = (sku: string, newStock: number) => {
    const updated = products.map((p) => {
      const hasVariant = p.variants.some((v) => v.sku === sku);
      if (!hasVariant) return p;
      return {
        ...p,
        variants: p.variants.map((v) =>
          v.sku === sku ? { ...v, stockQuantity: Math.max(0, newStock) } : v
        ),
      };
    });
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const resetToDefaults = () => {
    resetStoredProducts();
    setProducts(DEFAULT_PRODUCTS);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        resetToDefaults,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
