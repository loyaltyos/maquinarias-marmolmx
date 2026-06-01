import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://maquinariasmarmol.com.mx"),
  title: "Maquinarias Mármol MX | Maquinaria industrial y construcción en México",
  description:
    "Venta de maquinaria industrial, montacargas, soldadoras, dobladoras, revolvedoras y equipos de construcción en México.",
  alternates: { canonical: "https://maquinariasmarmol.com.mx" },
  keywords: [
    "maquinaria industrial México",
    "maquinaria construcción México",
    "dobladora de varilla",
    "soldadora industrial",
    "montacargas México",
    "revolvedora de concreto",
    "compactadora",
  ],
  openGraph: {
    title: "Maquinarias Mármol MX | Maquinaria industrial y construcción en México",
    description:
      "Venta de maquinaria industrial, montacargas, soldadoras, dobladoras, revolvedoras y equipos de construcción en México.",
    type: "website",
    locale: "es_MX",
    url: "https://maquinariasmarmol.com.mx",
    images: [
      {
        url: "/logo-marmolmx.png",
        width: 1280,
        height: 678,
        alt: "Mármol MX",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
