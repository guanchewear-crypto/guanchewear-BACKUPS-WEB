export interface Testimonial {
  text: string;
  author: string;
  location: string;
}

export const testimonials: Testimonial[] = [
  {
    text: 'Siempre quise una camiseta que representara mi tierra. Ahora tengo una que solo existe para mí.',
    author: 'Lucía',
    location: 'Gran Canaria',
  },
  {
    text: 'Lo pedí para un regalo y acerté de lleno. El diseño era exactamente lo que imaginaba.',
    author: 'Marcos',
    location: 'Madrid',
  },
  {
    text: 'Tardo más en decidir qué pedir del menú que en diseñar mi sudadera. El resultado siempre sorprende.',
    author: 'Elena',
    location: 'Barcelona',
  },
];