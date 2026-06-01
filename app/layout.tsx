import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://marmolmx.com.mx"),
  title: "Maquinarias Mármol MX | División Industrial de Mármol MX",
  description:
    "Maquinaria industrial, montacargas, soldadoras, dobladoras y equipos para construcción en México. División especializada de Mármol MX.",
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
    title: "Maquinarias Mármol MX | División Industrial de Mármol MX",
    description:
      "Maquinaria industrial, montacargas, soldadoras, dobladoras y equipos para construcción en México. División especializada de Mármol MX.",
    type: "website",
    locale: "es_MX",
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
