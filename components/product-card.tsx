import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
import { whatsappUrl } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-zinc-300 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-500 hover:shadow-xl">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-zinc-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col border-t-4 border-yellow-400 p-4">
        <p className="mb-2 inline-flex w-fit bg-zinc-900 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-400">
          {product.category}
        </p>
        <h3 className="mb-3 text-lg font-black uppercase leading-tight text-zinc-900">{product.name}</h3>
        <p className="mt-auto text-2xl font-black text-zinc-900">{formatPrice(product.price)}</p>
        <p className="mb-4 text-xs font-bold text-zinc-500">MXN · IVA incluido</p>
        <div className="flex gap-2">
          <Link
            href={`/producto/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-1 bg-yellow-400 px-3 py-3 text-xs font-black uppercase text-black transition hover:bg-yellow-300"
          >
            Ver detalle <ArrowRight size={15} />
          </Link>
          <AddToCart product={product} />
        </div>
        <a
          href={whatsappUrl(`Hola, quiero cotizar el equipo ${product.name} con precio de ${formatPrice(product.price)}.`)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center justify-center gap-2 border-2 border-zinc-900 px-3 py-2.5 text-xs font-black uppercase text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
        >
          <MessageCircle size={15} /> Cotizar por WhatsApp
        </a>
      </div>
    </article>
  );
}
