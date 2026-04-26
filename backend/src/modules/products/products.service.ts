import { Injectable, NotFoundException } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { Product } from './products.entity'

@Injectable()
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  async createProduct(productData: Product): Promise<Product> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }

    return data as Product
  }

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await this.supabaseService.getClient().from('products').select('*')

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return (data || []) as Product[]
  }

  async getProductById(id: string): Promise<Product> {
    const { data, error } = await this.supabaseService.getClient().from('products').select('*').eq('id', id).single()

    if (error || !data) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return data as Product
  }

  async update(id: string, updateData: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data as Product
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseService.getClient().from('products').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  }
}
