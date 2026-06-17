import { Product } from '../../src/modules/products/products.entity'

export const mockProduct: Product = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Тестовое украшение',
  price: 2500,
  category: 'сувениры',
  img: '/images/test-product.jpg',
  img2: '/images/test-product-2.jpg',
  img3: undefined,
  technic: 'плетение',
  diameter: '2 см',
  color: 'золотой',
  form: 'круг',
  material: 'бирюза',
  stock: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

export const mockProducts: Product[] = [
  mockProduct,
  {
    ...mockProduct,
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Серебряное кольцо',
    price: 3500,
    category: 'серьги',
    color: 'серебро',
  },
  {
    ...mockProduct,
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Брошь с жемчугом',
    price: 1800,
    category: 'броши',
    color: 'белый',
  },
]