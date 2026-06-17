import { Injectable, NotFoundException } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { Product } from './products.entity'
import { BaseService } from '../../database/base.service'

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(supabaseService: SupabaseService) {
    super(supabaseService, 'products')
  }

  async getProductsByCategory(category: string, excludeId?: string, limit: number = 12): Promise<Product[]> {
    let query = this.supabaseService.getClient().from('products').select('*').eq('category', category)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`)
    }

    return (data || []) as Product[]
  }
}