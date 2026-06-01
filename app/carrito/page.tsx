"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <section className="mx-auto min-h-[65vh] max-w-7xl px-4 py-12 lg:px-8">
      <Link href="/catalogo" className="mb-5 flex items-center gap-1 text-xs font-black uppercase text-zinc-600"><ChevronLeft size={17} /> Seguir comprando</Link>
      <h1 className="text-4xl font-black uppercase">Tu carrito</h1>
      {items.length === 0 ? (
        <div className="mt-8 border-l-4 border-yellow-400 bg-white p-7 shadow-sm">
          <p className="font-bold text-zinc-600">Tu carrito está vacío. Explora el catálogo y agrega el equipo que necesitas.</p>
          <Link href="/catalogo" className="mt-5 inline-block bg-zinc-900 px-5 py-3 text-xs font-black uppercase text-white">Ver catálogo</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-3">
            {items.map((item) => (
              <article key={item.id} className="grid gap-4 border border-zinc-300 bg-white p-3 shadow-sm sm:grid-cols-[130px_1fr_auto] sm:items-center">
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200"><Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 100vw, 130px" className="object-cover" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600">{item.category}</p>
                  <Link href={`/producto/${item.slug}`} className="mt-1 block font-black uppercase">{item.name}</Link>
                  <p className="mt-2 text-sm font-black">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col">
                  <div className="flex items-center border border-zinc-300">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2" aria-label="Reducir cantidad"><Minus size={15} /></button>
                    <span className="min-w-8 text-center text-sm font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2" aria-label="Aumentar cantidad"><Plus size={15} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 text-xs font-black uppercase text-red-600"><Trash2 size={15} /> Quitar</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit border-t-4 border-yellow-400 bg-zinc-900 p-6 text-white">
            <h2 className="text-xl font-black uppercase">Resumen</h2>
            <div className="mt-6 flex justify-between border-b border-zinc-700 pb-4 text-sm"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="flex justify-between border-b border-zinc-700 py-4 text-sm"><span>Envío</span><strong>Por cotizar</strong></div>
            <div className="flex justify-between py-5 text-lg font-black"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            <Link href="/checkout" className="block bg-yellow-400 px-5 py-4 text-center text-sm font-black uppercase text-black transition hover:bg-yellow-300">Continuar al pago</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
