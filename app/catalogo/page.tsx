"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/data/products";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const normalizedQuery = query.toLowerCase();
        const searchableText = [
          product.name,
          product.category,
          product.description,
          product.badge ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return (
          (category === "Todos" || product.category === category) &&
          searchableText.includes(normalizedQuery)
        );
      }),
    [category, query],
  );

  return (
    <>
      <section className="concrete border-b-4 border-yellow-400 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-400">Catálogo completo</p>
          <h1 className="mt-3 text-5xl font-black uppercase sm:text-6xl">Maquinaria para tu operación</h1>
          <p className="mt-4 max-w-2xl text-zinc-300">Encuentra equipos robustos para obra, taller, almacén e industria.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-4 border border-zinc-300 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
          <label className="flex items-center gap-3 border border-zinc-300 px-4 py-3">
            <Search size={19} className="text-zinc-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre de equipo" className="w-full bg-transparent text-sm font-bold outline-none" />
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={`px-3 py-3 text-xs font-black uppercase transition ${category === item ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-700 hover:bg-yellow-400 hover:text-black"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <p className="mb-5 mt-9 text-sm font-black uppercase text-zinc-500">{filteredProducts.length} equipos encontrados</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {filteredProducts.length === 0 && (
          <div className="border-l-4 border-yellow-400 bg-white p-6 font-bold text-zinc-600 shadow-sm">
            No encontramos equipos con esos criterios. Prueba otra categoría o término de búsqueda.
          </div>
        )}
      </section>
    </>
  );
}
