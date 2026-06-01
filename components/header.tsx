"use client";

import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  ["Inicio", "/"],
  ["Catálogo", "/catalogo"],
  ["Nosotros", "/#nosotros"],
  ["Contacto", "/#contacto"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-yellow-400 bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-3 px-4 py-2 lg:px-8">
        <div onClick={() => setOpen(false)}><BrandLogo /></div>
        <nav className="hidden items-center gap-7 text-sm font-bold uppercase tracking-wide md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-yellow-400">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            aria-label="Abrir carrito"
            className="relative flex size-11 items-center justify-center border border-zinc-700 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid size-5 place-items-center bg-red-600 text-xs font-black text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="grid size-11 place-items-center border border-zinc-700 md:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Abrir menú"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid border-t border-zinc-800 bg-zinc-950 px-4 py-3 md:hidden">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="border-b border-zinc-800 py-4 text-sm font-black uppercase"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
