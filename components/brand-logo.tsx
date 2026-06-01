import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="block w-fit" aria-label="Mármol MX - División Maquinarias">
      <Image
        src="/logo-marmolmx.png"
        alt="Mármol MX"
        width={1280}
        height={678}
        priority={!compact}
        sizes={compact ? "190px" : "(max-width: 640px) 152px, 190px"}
        className={`${compact ? "w-48" : "w-38 sm:w-48"} h-auto`}
      />
      <span className="mt-1 block text-center text-[9px] font-black uppercase tracking-[0.28em] text-yellow-400 sm:text-[10px]">
        División Maquinarias
      </span>
    </Link>
  );
}
