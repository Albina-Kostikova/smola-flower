import { Product } from '@/entities/product';

export const products: Product[] = [
  {
    id: 1,
    title: 'Серьги Лепестки',
    price: 2200,
    description: 'Легкие серьги из смолы с цветочными лепестками.',
    category: 'Серьги',
    image: '/file.svg',
  },
  {
    id: 2,
    title: 'Кулон Весна',
    price: 1800,
    description: 'Прозрачный кулон с натуральными травами.',
    category: 'Кулоны',
    image: '/globe.svg',
  },
  {
    id: 3,
    title: 'Брошь Цветок',
    price: 2500,
    description: 'Ручная брошь с эффектом акварели.',
    category: 'Броши',
    image: '/window.svg',
  },
];