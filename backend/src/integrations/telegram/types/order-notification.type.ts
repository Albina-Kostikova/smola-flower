export interface OrderNotification {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  delivery: string
  payment: string
  products: Array<{
    name: string
    quantity: number
  }>
  total: number
  status?: string
  createdAt?: string
}
