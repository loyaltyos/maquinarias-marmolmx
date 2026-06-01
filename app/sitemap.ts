import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const baseUrl = "https://maquinariasmarmol.com.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    "",
    "/catalogo",
    "/carrito",
    "/checkout",
    "/contacto",
    "/aviso-de-privacidad",
    "/terminos-y-condiciones",
    "/devoluciones-y-reembolsos",
    "/envios",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/catalogo" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/catalogo" ? 0.9 : 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/producto/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...productPages];
}
