export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "dobladora-varilla-gw55",
    name: "Dobladora de Varilla GW55",
    price: 98900,
    category: "Dobladoras",
    description:
      "Equipo industrial para doblado de varilla en obra y taller. Ideal para trabajos de construcción, estructuras y producción continua.",
    image: "/images/dobladora.webp",
    badge: "Alta demanda",
  },
  {
    id: 2,
    slug: "dobladora-hidraulica-32mm",
    name: "Dobladora Hidráulica 32mm",
    price: 159900,
    category: "Dobladoras",
    description:
      "Máquina hidráulica para doblado de acero y varilla de alta resistencia. Recomendada para contratistas y constructoras.",
    image: "/images/dobladora.webp",
  },
  {
    id: 3,
    slug: "planta-soldar-industrial-250a",
    name: "Planta de Soldar Industrial 250A",
    price: 18900,
    category: "Soldadoras",
    description:
      "Soldadora industrial para trabajos de mantenimiento, herrería, estructura metálica y taller.",
    image: "/images/soldadora.webp",
  },
  {
    id: 4,
    slug: "soldadora-microalambre-500a",
    name: "Soldadora Microalambre 500A",
    price: 52900,
    category: "Soldadoras",
    description:
      "Equipo de soldadura de alto rendimiento para producción industrial, estructuras metálicas y procesos continuos.",
    image: "/images/soldadora.webp",
  },
  {
    id: 5,
    slug: "montacargas-25-toneladas-usado",
    name: "Montacargas 2.5 Toneladas Usado",
    price: 365000,
    category: "Montacargas",
    description:
      "Montacargas de trabajo pesado para almacenes, patios industriales, carga y descarga.",
    image: "/images/montacargas.webp",
    badge: "Revisado",
  },
  {
    id: 6,
    slug: "montacargas-5-toneladas-seminuevo",
    name: "Montacargas 5 Toneladas Seminuevo",
    price: 645000,
    category: "Montacargas",
    description:
      "Equipo de carga para operaciones industriales de mayor capacidad. Ideal para bodegas, patios y obra.",
    image: "/images/montacargas.webp",
    badge: "Seminuevo",
  },
  {
    id: 7,
    slug: "revolvedora-1-saco-motor-gasolina",
    name: "Revolvedora 1 Saco Motor Gasolina",
    price: 47900,
    category: "Revolvedoras",
    description:
      "Revolvedora robusta para obra, mezcla de concreto y trabajo continuo en construcción.",
    image: "/images/revolvedora.webp",
  },
  {
    id: 8,
    slug: "revolvedora-medio-saco",
    name: "Revolvedora 1/2 Saco",
    price: 12900,
    category: "Revolvedoras",
    description:
      "Mezcladora práctica para trabajos medianos y pequeños de construcción.",
    image: "/images/revolvedora.webp",
  },
  {
    id: 9,
    slug: "bailarina-compactadora-4hp",
    name: "Bailarina Compactadora 4HP",
    price: 29900,
    category: "Compactación",
    description:
      "Compactadora tipo bailarina para suelos, zanjas, cimentaciones y obra civil.",
    image: "/images/compactacion.webp",
  },
  {
    id: 10,
    slug: "rodillo-vibratorio-65hp",
    name: "Rodillo Vibratorio 6.5HP",
    price: 42900,
    category: "Compactación",
    description:
      "Rodillo compactador para superficies, caminos, obra civil y preparación de terreno.",
    image: "/images/compactacion.webp",
  },
  {
    id: 11,
    slug: "soldadora-inversora-industrial-250a",
    name: "Soldadora Inversora Industrial 250A",
    price: 12000,
    category: "Soldadura",
    description:
      "Soldadora inversora industrial de alto rendimiento para trabajos de fabricacion, mantenimiento y construccion. Disenada para operacion continua y uso profesional.",
    image: "/images/soldadora.webp",
    badge: "Producto destacado",
  },
  {
    id: 12,
    slug: "dobladora-manual-varilla-media-pulgada",
    name: "Dobladora Manual para Varilla 1/2\"",
    price: 15000,
    category: "Construccion",
    description:
      "Equipo para doblado preciso de varilla utilizado en obras civiles, construccion y estructuras metalicas.",
    image: "/images/dobladora.webp",
    badge: "Producto destacado",
  },
  {
    id: 13,
    slug: "revolvedora-concreto-1-saco",
    name: "Revolvedora de Concreto 1 Saco",
    price: 20000,
    category: "Construccion",
    description:
      "Revolvedora de concreto para uso profesional en proyectos de construccion, remodelacion e infraestructura.",
    image: "/images/revolvedora.webp",
    badge: "Producto destacado",
  },
  {
    id: 14,
    slug: "producto-prueba-integracion-conekta",
    name: "Producto de prueba integración Conekta",
    price: 1000,
    category: "Prueba de pago",
    description:
      "Producto creado únicamente para pruebas de integración de pago. Este artículo permite validar el flujo de compra, checkout y confirmación de pedido en ambiente de pruebas.",
    image: "/images/hero-industrial.webp",
    badge: "Producto de prueba",
  },
];

export const categories = [
  "Todos",
  "Soldadura",
  "Construccion",
  "Dobladoras",
  "Soldadoras",
  "Montacargas",
  "Revolvedoras",
  "Compactación",
  "Prueba de pago",
];
