import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock,
  Cog,
  Construction,
  Factory,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { whatsappUrl } from "@/lib/whatsapp";
import { IndustrialTrust } from "@/components/industrial-trust";
import { TestimonialsSlider } from "@/components/testimonials-slider";
import { COMPANY } from "@/lib/company";

const categories = [
  ["Dobladoras de varilla", Cog, "Equipos para acero y estructura"],
  ["Soldadoras industriales", Zap, "Potencia para taller y producción"],
  ["Montacargas", Factory, "Carga segura para patios y bodegas"],
  ["Revolvedoras", Construction, "Mezcla continua para tu obra"],
  ["Compactación", Wrench, "Preparación de terreno resistente"],
  ["Equipos para obra", Building2, "Soluciones listas para trabajar"],
] as const;

export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[620px] overflow-hidden bg-zinc-950 text-white sm:min-h-[680px]">
        <Image src="/images/hero-industrial.webp" alt="Maquinaria industrial lista para trabajar" fill priority sizes="100vw" className="object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-3 hazard" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20 sm:min-h-[680px] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 border-l-4 border-yellow-400 bg-black/60 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-yellow-400">
              <ShieldCheck size={17} /> Equipos listos para trabajar
            </p>
            <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
              Maquinaria industrial para <span className="text-yellow-400">trabajo real</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-bold leading-7 text-zinc-200 sm:text-xl">
              Dobladoras, soldadoras, montacargas y equipos para construcción en todo México.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="flex items-center justify-center gap-2 bg-yellow-400 px-7 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300">
                Ver catálogo <ArrowRight size={18} />
              </Link>
              <a href={whatsappUrl("Hola, quiero cotizar maquinaria de Maquinarias Mármol MX.")} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border-2 border-white px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-white hover:text-black">
                <MessageCircle size={18} /> Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <IndustrialTrust />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Catálogo por categoría</p>
        <h2 className="mt-2 text-4xl font-black uppercase text-zinc-900">Equipo para cada frente de trabajo</h2>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([title, Icon, body]) => (
            <Link href="/catalogo" key={title} className="group border-l-4 border-yellow-400 bg-zinc-900 p-6 text-white transition hover:bg-red-600">
              <Icon size={31} className="text-yellow-400 transition group-hover:text-white" />
              <h3 className="mt-5 text-xl font-black uppercase">{title}</h3>
              <p className="mt-1 text-sm text-zinc-300">{body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="concrete text-white" id="nosotros">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-400">Sobre Maquinarias Mármol MX</p>
            <h2 className="mt-3 text-4xl font-black uppercase sm:text-5xl">Trabajo duro. Equipo confiable.</h2>
            <p className="mt-6 max-w-2xl leading-7 text-zinc-300">
              En Maquinarias Mármol MX ofrecemos soluciones confiables para construcción, obra civil, talleres e industria. Nuestro objetivo es conectar a nuestros clientes con maquinaria resistente, funcional y lista para trabajar, priorizando calidad, atención directa y precios competitivos.
            </p>
            <p className="mt-4 max-w-2xl border-l-4 border-yellow-400 pl-4 text-sm font-bold leading-6 text-zinc-200">
              Maquinarias Mármol MX forma parte de Mármol MX, empresa comprometida con brindar soluciones para construcción, industria y desarrollo de proyectos en todo México.
            </p>
          </div>
          <div className="grid gap-3">
            <article className="border-l-4 border-yellow-400 bg-black/35 p-6">
              <Target className="text-yellow-400" />
              <h3 className="mt-3 text-xl font-black uppercase">Nuestra visión</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">Ser una empresa referente en México en la venta de maquinaria industrial y de construcción, ayudando a negocios, contratistas y empresas a equiparse con herramientas fuertes, duraderas y eficientes.</p>
            </article>
            <article className="border-l-4 border-red-600 bg-black/35 p-6">
              <ShieldCheck className="text-red-500" />
              <h3 className="mt-3 text-xl font-black uppercase">Nuestro objetivo</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">Facilitar la compra de maquinaria de trabajo mediante una experiencia clara, rápida y segura, con atención personalizada antes y después de cada compra.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Selección destacada</p>
            <h2 className="mt-2 text-4xl font-black uppercase">Maquinaria lista para trabajar</h2>
          </div>
          <Link href="/catalogo" className="flex items-center gap-2 text-sm font-black uppercase text-red-600">Ver todo el catálogo <ArrowRight size={18} /></Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <TestimonialsSlider />

      <section id="contacto" className="bg-red-700 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">Contacto</p>
            <h2 className="mt-3 text-4xl font-black uppercase">¿Qué equipo necesitas?</h2>
            <p className="mt-4 max-w-2xl text-red-100">{COMPANY.shippingText}</p>
            <div className="mt-7 grid gap-3 text-sm font-bold sm:grid-cols-2">
              <p className="flex gap-2"><MapPin size={19} /> {COMPANY.location}</p>
              <p className="flex gap-2"><Clock size={19} /> {COMPANY.schedule}</p>
              {COMPANY.emails.map((email) => <a key={email} href={`mailto:${email}`} className="flex gap-2 transition hover:text-yellow-300"><Mail size={19} /> {email}</a>)}
            </div>
          </div>
          <a href={whatsappUrl("Hola, quiero cotizar maquinaria de Maquinarias Mármol MX.")} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-yellow-400 px-7 py-4 text-sm font-black uppercase text-black transition hover:bg-yellow-300">
            <MessageCircle size={19} /> Escribir por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
