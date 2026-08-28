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

export const brandInfo: BrandInfo = {
  name: 'GUANCHEWEAR',
  origin: 'Islas Canarias',
  email: 'guanchewear@gmail.com',
  instagram: '@guanchewear',
  products: [
    { type: 'camiseta', price: 25, label: 'Camiseta — 25 €' },
    { type: 'sudadera', price: 35, label: 'Sudadera — 35 €' },
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Negro', 'Blanco', 'Azul marino', 'Gris'],
  tagline: 'TU IDEA. TU DISEÑO.',
};

/* Gold accent variants per collection — still distinct but all gold */
export const collections: Collection[] = [
  {
    id: 'monaco-riviera',
    name: 'MONACO RIVIERA NIGHTS',
    accent: '#D4A853',
    accentLight: '#E8C06A',
    image: '/garments/monaco-riviera.svg',
    text: 'Lujo nocturno, velocidad y libertad. Una composición inspirada en la Riviera y en quienes construyen su propio camino.',
    tags: ['LUXURY', 'MOTION', 'FREEDOM'],
    number: '01',
  },
  {
    id: 'monaco-lifestyle',
    name: 'MONACO LIFESTYLE',
    accent: '#B8912E',
    accentLight: '#D4A853',
    image: '/garments/monaco-lifestyle.svg',
    text: 'Tradición, prestigio y carácter. Una pieza construida alrededor de Monte Carlo, el automovilismo y una vida sin concesiones.',
    tags: ['POWER', 'PRESTIGE', 'TRADITION'],
    number: '02',
  },
  {
    id: 'puerto-rico',
    name: 'PUERTO RICO',
    accent: '#C4993A',
    accentLight: '#E0B050',
    image: '/garments/puerto-rico.svg',
    text: 'Orgullo, cultura y disciplina. Una identidad nacida en la isla y construida en la calle.',
    tags: ['ORGULLO', 'CULTURA', 'DISCIPLINA'],
    number: '03',
  },
];

export const marqueeItems: string[] = [
  'DISEÑOS ÚNICOS',
  'PRODUCCIÓN EUROPEA',
  'ENVÍO 2-4 DÍAS',
  'ATENCIÓN PERSONAL',
];

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
