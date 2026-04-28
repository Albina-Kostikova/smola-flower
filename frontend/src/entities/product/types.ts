export interface Product {
  id: string
  title: string
  price: number
  description?: string
  category?: string
  img?: string
  img2?: string
  img3?: string
  technic?: string
  diameter?: string
  color?: string
  form?: string
  material?: string
  stock: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type PartialProduct = Partial<Product>
