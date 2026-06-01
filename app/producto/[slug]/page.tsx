import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Link href="/catalogo" className="mb-6 flex items-center gap-1 text-xs font-black uppercase text-zinc-600 transition hover:text-red-600"><ChevronLeft size={17} /> Volver al catálogo</Link>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden border border-zinc-300 bg-zinc-200">
            <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">{product.category}</p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-3xl font-black">{formatPrice(product.price)}</p>
            <p className="text-xs font-bold text-zinc-500">MXN · IVA incluido</p>
            <div className="mt-5 border-l-4 border-yellow-400 bg-zinc-900 px-4 py-4 text-white">
              <p className="text-sm font-black uppercase">Solicita una cotización personalizada</p>
              <p className="mt-1 text-xs leading-5 text-zinc-300">Confirma disponibilidad, envío y atención para tu operación.</p>
            </div>
            <p className="mt-6 leading-7 text-zinc-600">{product.description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AddToCart product={product} large />
              <a href={whatsappUrl(`Hola, quiero cotizar el equipo ${product.name} con precio de ${formatPrice(product.price)}.`)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border-2 border-zinc-900 px-5 py-4 text-sm font-black uppercase transition hover:bg-zinc-900 hover:text-white">
                <MessageCircle size={18} /> Cotizar este equipo por WhatsApp
              </a>
            </div>
            <div className="mt-8 grid gap-3 border-t border-zinc-300 pt-6 text-sm font-bold text-zinc-700 sm:grid-cols-3">
              <p className="flex items-center gap-2"><ShieldCheck size={20} className="text-red-600" /> Compra segura</p>
              <p className="flex items-center gap-2"><Truck size={20} className="text-red-600" /> Envíos en México</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={20} className="text-red-600" /> Atención directa</p>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <h2 className="mb-7 text-3xl font-black uppercase">También te puede interesar</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </>
  );
}
