"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useRef } from "react";

const reviews = [
  {
    name: "Carlos Hernández",
    role: "Supervisor de Obra",
    image: "/images/testimonial-carlos.webp",
    quote: "La dobladora llegó lista para trabajar. Excelente atención durante todo el proceso.",
  },
  {
    name: "Miguel Torres",
    role: "Contratista Independiente",
    image: "/images/testimonial-miguel.webp",
    quote: "Necesitábamos una revolvedora urgente y el proceso fue rápido y claro.",
  },
  {
    name: "Roberto Gómez",
    role: "Encargado de Taller",
    image: "/images/testimonial-roberto.webp",
    quote: "La planta de soldar ha funcionado perfectamente desde el primer día.",
  },
];

export function TestimonialsSlider() {
  const slider = useRef<HTMLDivElement>(null);

  function scroll(direction: number) {
    slider.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  }

  return (
    <section className="bg-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Opiniones de nuestros clientes</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-black uppercase">Confianza construida con trabajo real</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} className="grid size-11 place-items-center border-2 border-zinc-900 transition hover:bg-zinc-900 hover:text-white" aria-label="Reseñas anteriores"><ArrowLeft size={19} /></button>
            <button onClick={() => scroll(1)} className="grid size-11 place-items-center bg-zinc-900 text-white transition hover:bg-yellow-400 hover:text-black" aria-label="Reseñas siguientes"><ArrowRight size={19} /></button>
          </div>
        </div>
        <div ref={slider} className="no-scrollbar mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
          {reviews.map((review) => (
            <article key={review.name} className="min-w-[88%] snap-start border border-zinc-300 bg-white p-6 shadow-sm sm:min-w-[360px] lg:min-w-[calc(33.333%-11px)]">
              <div className="flex items-center gap-4 border-b border-zinc-200 pb-5">
                <Image src={review.image} alt={review.name} width={62} height={62} className="size-16 object-cover" />
                <div>
                  <h3 className="font-black uppercase">{review.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500">{review.role}</p>
                </div>
              </div>
              <div className="mt-5 flex gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
              </div>
              <p className="mt-4 text-sm font-bold leading-6 text-zinc-700">“{review.quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
