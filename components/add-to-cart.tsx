"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/cart-provider";

export function AddToCart({ product, large = false }: { product: Product; large?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-yellow-400 font-black uppercase text-black transition hover:bg-yellow-300 ${
        large ? "w-full px-6 py-4 text-sm sm:w-auto" : "px-3 py-3 text-xs"
      }`}
    >
      <ShoppingCart size={17} /> {added ? "Agregado" : "Agregar"}
    </button>
  );
}
