"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/ecommerce";
import {
  getStoredProducts,
  saveStoredProducts,
  resetStoredProducts,
} from "@/lib/products-store";
import {
  fetchProductsFromDatabase,
  saveProductToDatabase,
  deleteProductFromDatabase,
} from "@/lib/database-service";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/data/mock-products";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateStock: (sku: string, newStock: number) => void;
  resetToDefaults: () => void;
  isDatabaseConnected: boolean;
  refreshFromDatabase: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(isSupabaseConfigured);

  const refreshFromDatabase = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const dbProducts = await fetchProductsFromDatabase();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        saveStoredProducts(dbProducts);
        setIsDatabaseConnected(true);
      }
    } catch (err) {
      console.error("Failed to refresh products from database", err);
    }
  };

  useEffect(() => {
    // 1. Immediately load cached / default products so UI is instant
    setProducts(getStoredProducts());
    setIsInitialized(true);

    // 2. Asynchronously sync with Supabase if configured
    if (isSupabaseConfigured) {
      refreshFromDatabase();
    }

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

    if (isSupabaseConfigured) {
      saveProductToDatabase(newProd).catch(console.error);
    }
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    setProducts(updated);
    saveStoredProducts(updated);

    if (isSupabaseConfigured) {
      saveProductToDatabase(updatedProd).catch(console.error);
    }
  };

  const deleteProduct = (productId: string) => {
    const toDelete = products.find((p) => p.id === productId);
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveStoredProducts(updated);

    if (isSupabaseConfigured && toDelete) {
      deleteProductFromDatabase(toDelete.slug).catch(console.error);
    }
  };

  const updateStock = (sku: string, newStock: number) => {
    const updated = products.map((p) => {
      const hasVariant = p.variants.some((v) => v.sku === sku);
      if (!hasVariant) return p;
      const updatedProduct = {
        ...p,
        variants: p.variants.map((v) =>
          v.sku === sku ? { ...v, stockQuantity: Math.max(0, newStock) } : v
        ),
      };

      if (isSupabaseConfigured) {
        saveProductToDatabase(updatedProduct).catch(console.error);
      }

      return updatedProduct;
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
        isDatabaseConnected,
        refreshFromDatabase,
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
