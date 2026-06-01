import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

export function LegalPage({
  title,
  updated = "Última actualización: junio de 2026",
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="concrete border-b-4 border-yellow-400 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-yellow-400">
            <FileText size={17} /> Información legal
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm font-bold text-zinc-400">{updated}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <Link href="/" className="mb-7 flex items-center gap-1 text-xs font-black uppercase text-zinc-600 transition hover:text-red-600">
          <ChevronLeft size={17} /> Volver al inicio
        </Link>
        <article className="legal-content border-t-4 border-yellow-400 bg-white p-6 shadow-sm sm:p-9">
          {children}
        </article>
      </section>
    </>
  );
}
