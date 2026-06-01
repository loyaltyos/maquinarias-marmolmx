import type { MetadataRoute } from "next";

const baseUrl = "https://maquinariasmarmol.com.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
}
