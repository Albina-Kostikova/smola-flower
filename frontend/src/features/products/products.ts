import { Product } from '@/entities/product'

export const products: Product[] = [
  {
    id: "1",
    title: 'Серьги Лепестки',
    price: 2200,
    description: 'Легкие серьги из смолы с цветочными лепестками.',
    category: 'Серьги',
    img: '/images/product1.jpg',
    img2: '/images/product1.jpg',
    img3: '/images/product1.jpg',
    stock: true
  },
  {
    id: '2',
    title: 'Кулон Весна',
    price: 1800,
    description: 'Прозрачный кулон с натуральными травами.',
    category: 'Кулоны',
    img: '/images/product2.jpg',
    stock: true
  },
  {
    id: '3',
    title: 'Брошь Цветок',
    price: 2500,
    description: 'Ручная брошь с эффектом акварели.',
    category: 'Броши',
    img: '/images/product3.jpg',
    stock: false
  },
]