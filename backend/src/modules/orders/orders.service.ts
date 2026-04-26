import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './order.entity'
import { Product } from '../products/products.entity'

@Injectable()
export class OrdersService {
  constructor(
    private supabaseService: SupabaseService,
    private telegramService: TelegramService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const client = this.supabaseService.getClient()
    const productIds = dto.products.map(p => p.productId)

    // Fetch products by IDs
    const { data: products, error: productsError } = await client
      .from('products')
      .select('*')
      .in('id', productIds)

    if (productsError || !products || products.length === 0) {
      throw new BadRequestException('Products not found')
    }

    let total = 0

    const productsWithNames = dto.products.map(p => {
      const product = (products as Product[]).find(x => x.id === p.productId)

      if (!product) {
        throw new BadRequestException(`Product ${p.productId} not found`)
      }

      const itemTotal = Number(product.price) * p.quantity
      total += itemTotal

      return {
        name: product.title,
        quantity: p.quantity,
      }
    })

    const orderData = {
      ...dto,
      total,
      status: 'new',
    }

    // Insert order
    const { data: savedOrder, error: orderError } = await client
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    await this.telegramService.sendOrderNotification({
      ...dto,
      total,
      products: productsWithNames,
    })

    return savedOrder as Order
  }

  async findAll(): Promise<Order[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return (data || []) as Order[]
  }

  async findOne(id: string): Promise<Order> {
    const { data: order, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !order) {
      throw new NotFoundException('Order not found')
    }

    return order as Order
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const order = await this.findOne(id)

    const { data: updatedOrder, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`)
    }

    return updatedOrder as Order
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id)

    const { error } = await this.supabaseService
      .getClient()
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete order: ${error.message}`)
    }
  }
}