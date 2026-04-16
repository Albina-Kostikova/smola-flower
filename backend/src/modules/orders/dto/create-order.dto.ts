export class CrerateOrderDto {
  delivery: string
  payment: string
  name: string
  email: string
  phone: string
  address: string
  products: {
    productId: string
    quantity: number
  }[]
  total: number
}