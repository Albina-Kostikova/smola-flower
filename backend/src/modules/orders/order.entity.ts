export interface Order {
  id: string
  name: string
  email: string
  phone: string
  address: string
  delivery: string
  payment: string
  products: {
    productId: string
    quantity: number
  }[]
  total: number
  status: string
  createdAt: Date
  updatedAt: Date
}