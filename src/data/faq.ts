export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: '¿Qué tipos de prenda ofrecéis?',
    answer: 'Camisetas y sudaderas personalizadas, disponibles en tallas S, M, L, XL y XXL.',
  },
  {
    question: '¿Cómo funciona el proceso?',
    answer: 'Eliges la prenda, nos cuentas tu idea, recibes dos propuestas, eliges tu favorita y la producimos.',
  },
  {
    question: '¿Puedo pedir cambios?',
    answer: 'Sí. Puedes solicitar ajustes para que el resultado represente mejor lo que imaginabas.',
  },
  {
    question: '¿Los diseños se repiten?',
    answer: 'No trabajamos con un catálogo genérico. Cada encargo se desarrolla para la persona que lo solicita.',
  },
  {
    question: '¿Cuánto tarda el pedido?',
    answer: 'El plazo estimado es de 2–4 días laborables desde la confirmación del diseño.',
  },
  {
    question: '¿Hacéis envíos a Europa?',
    answer: 'Sí. Enviamos a España y al resto de la Unión Europea.',
  },
  {
    question: '¿Puedo devolver una prenda personalizada?',
    answer: 'Al tratarse de un producto personalizado, no se admiten devoluciones por cambio de opinión. Si existe un defecto de fabricación, sustituimos la prenda.',
  },
];