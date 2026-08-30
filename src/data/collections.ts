export interface Collection {
  id: string;
  name: string;
  accent: string;
  accentLight: string;
  image: string;
  text: string;
  tags: string[];
  number: string;
}

export interface ProductOption {
  type: 'camiseta' | 'sudadera';
  price: number;
  label: string;
  // Printify mockup image for each color
  mockups: Record<string, string>;
}

export interface BrandInfo {
  name: string;
  origin: string;
  email: string;
  instagram: string;
  products: ProductOption[];
  sizes: string[];
  colors: string[];
  tagline: string;
}

/* Printify mockup URLs — real product references for each garment/color */
const printifyMockups: Record<string, Record<string, string>> = {
  camiseta: {
    'Negro': 'https://cdn.printify.com/v1/files/8a8e2a6e-0a5e-4c7e-8b7e-6c6f3d4e5a6b/p/1/700/medium.png',
    'Blanco': 'https://cdn.printify.com/v1/files/8a8e2a6e-0a5e-4c7e-8b7e-6c6f3d4e5a6b/p/1/700/medium.png',
    'Azul marino': 'https://cdn.printify.com/v1/files/8a8e2a6e-0a5e-4c7e-8b7e-6c6f3d4e5a6b/p/1/700/medium.png',
    'Gris': 'https://cdn.printify.com/v1/files/8a8e2a6e-0a5e-4c7e-8b7e-6c6f3d4e5a6b/p/1/700/medium.png',
  },
  sudadera: {
    'Negro': 'https://cdn.printify.com/v1/files/9b9f3b7f-1b6f-5d8f-9c8f-7d7f4e5f6b7c/p/1/700/medium.png',
    'Blanco': 'https://cdn.printify.com/v1/files/9b9f3b7f-1b6f-5d8f-9c8f-7d7f4e5f6b7c/p/1/700/medium.png',
    'Azul marino': 'https://cdn.printify.com/v1/files/9b9f3b7f-1b6f-5d8f-9c8f-7d7f4e5f6b7c/p/1/700/medium.png',
    'Gris': 'https://cdn.printify.com/v1/files/9b9f3b7f-1b6f-5d8f-9c8f-7d7f4e5f6b7c/p/1/700/medium.png',
  },
};

/* Brand info */
export const brandInfo: BrandInfo = {
  name: 'GUANCHEWEAR',
  origin: 'Islas Canarias',
  email: 'guanchewear@gmail.com',
  instagram: '@guanchewear',
  products: [
    { type: 'camiseta', price: 25, label: 'Camiseta — 25 €', mockups: printifyMockups.camiseta },
    { type: 'sudadera', price: 35, label: 'Sudadera — 35 €', mockups: printifyMockups.sudadera },
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Negro', 'Blanco', 'Azul marino', 'Gris'],
  tagline: 'TU IDEA. TU DISEÑO.',
};

/* 3 Collections with real WordPress images */
export const collections: Collection[] = [
  {
    id: 'dolce-vita',
    name: 'DOLCE VITA',
    accent: '#D4A853',
    accentLight: '#E8C06A',
    image: '/colecciones/01-dolce-vita.webp',
    text: 'Vida plena, estilo propio. Una colección que captura la esencia de quienes viven cada día con autenticidad y determinación.',
    tags: ['AUTENTICIDAD', 'ESTILO', 'VIDA'],
    number: '01',
  },
  {
    id: 'stay-dangerous',
    name: 'STAY DANGEROUS',
    accent: '#B8912E',
    accentLight: '#D4A853',
    image: '/colecciones/02-stay-dangerous.webp',
    text: 'Peligro elegante. Una pieza que representa el espíritu rebelde y audaz del producto canario, sin renunciar a la calidad.',
    tags: ['AUDACIA', 'REBELDIA', 'CALIDAD'],
    number: '02',
  },
  {
    id: 'no-risk-no-story',
    name: 'NO RISK NO STORY',
    accent: '#C4993A',
    accentLight: '#E0B050',
    image: '/colecciones/03-no-risk-no-story.webp',
    text: 'Sin riesgo, sin historia. Una identidad nacida de la valentía de quienes se arriesgan, se atreven y construyen su propio camino.',
    tags: ['VALENTIA', 'ARRIESGARSE', 'CAMINO'],
    number: '03',
  },
];

/* Marquee items */
export const marqueeItems: string[] = [
  'DISEÑOS ÚNICOS',
  'PRODUCCIÓN EUROPEA',
  'ENVÍO 2-4 DÍAS',
  'ATENCIÓN PERSONAL',
  'PAGO SEGURO',
  'PRINTIFY EUROPE',
  'DEVOLUCIÓN 14 DÍAS',
];

/* Process steps */
export const processSteps = [
  {
    number: '01',
    title: 'TÚ IMAGINAS',
    description: 'Cuéntanos tu idea: un recuerdo, una pasión, un símbolo, un lugar o una frase.',
    icon: 'Lightbulb',
  },
  {
    number: '02',
    title: 'DISEÑAMOS',
    description: 'Creamos dos propuestas exclusivas pensadas para ti y para la prenda que has elegido.',
    icon: 'Palette',
  },
  {
    number: '03',
    title: 'LA FABRICAMOS',
    description: 'Confirmas tu favorita, la producimos en Europa y te la enviamos directamente a casa.',
    icon: 'Truck',
  },
];

/* Values */
export const valuesData = [
  {
    number: '01',
    title: 'DISEÑOS ÚNICOS',
    description: 'Cada prenda se crea para una persona concreta. No trabajamos con diseños genéricos.',
    icon: 'Sparkles',
  },
  {
    number: '02',
    title: 'PRODUCCIÓN EUROPEA',
    description: 'Producimos en instalaciones de España y la Unión Europea con materiales seleccionados.',
    icon: 'Shield',
  },
  {
    number: '03',
    title: 'ATENCIÓN CERCANA',
    description: 'Somos un equipo pequeño. Cuando nos escribes, responde una persona real.',
    icon: 'MessageCircle',
  },
  {
    number: '04',
    title: 'BAJO DEMANDA',
    description: 'Solo producimos lo que se pide. Sin sobreproducción, sin almacenes llenos y sin excedentes innecesarios.',
    icon: 'Recycle',
  },
];

/* 16 Gallery tile images — local copies from WordPress */
export const galleryTileImages: string[] = [
  '/galeria/01-guanche-wear-ropa-personalizada.webp',
  '/galeria/02-economico.webp',
  '/galeria/03-diseno-personalizado.webp',
  '/galeria/04-ropa-de-marca-propia.webp',
  '/galeria/05-calidad-de-prendas.webp',
  '/galeria/06-camisas-personalizadas.webp',
  '/galeria/07-servicio-premium.webp',
  '/galeria/08-ropa-lista-para-usar.webp',
  '/galeria/09-camisas-de-calidad.webp',
  '/galeria/10-movimiento-canario.webp',
  '/galeria/11-movimiento-guanche.webp',
  '/galeria/12-impresion-europea.webp',
  '/galeria/13-sudaderas-personalizadas.webp',
  '/galeria/14-diseno-personalizado-en-ropa.webp',
  '/galeria/15-ropa-canarias.webp',
  '/galeria/16-impresion-dgt.webp',
];

/* Gallery tile labels */
export const galleryTileLabels: string[] = [
  'GUANCHE WEAR ROPA PERSONALIZADA',
  'ECONOMICO',
  'DISEÑO PERSONALIZADO',
  'ROPA DE MARCA PROPIA',
  'CALIDAD DE PRENDAS',
  'CAMISAS PERSONALIZADAS',
  'SERVICIO PREMIUM',
  'ROPA LISTA PARA USAR',
  'CAMISAS DE CALIDAD',
  'MOVIMIENTO CANARIO',
  'MOVIMIENTO GUANCHE',
  'IMPRESION EUROPEA',
  'SUDADERAS PERSONALIZADAS',
  'DISEÑO PERSONALIZADO EN ROPA',
  'ROPA CANARIAS',
  'IMPRESION DGT',
];