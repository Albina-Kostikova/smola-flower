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

    // Поддержка обоих форматов данных
    const isNewFormat = !!dto.customer
    const name = isNewFormat ? dto.customer!.fio : dto.name
    const email = isNewFormat ? dto.customer!.email : dto.email
    const phone = isNewFormat ? dto.customer!.phone : dto.phone
    const address = isNewFormat ? dto.customer!.address : dto.address
    const items = isNewFormat ? dto.items : dto.products
    const delivery = dto.delivery || 'unknown'
    const payment = dto.payment || 'unknown'

    if (!name || !email || !phone || !address || !items) {
      throw new BadRequestException('Missing required order data')
    }

    // Для нового формата товары берутся напрямую, для старого - ищем в БД
    let total = 0
    let productsForTelegram: Array<{ name: string; quantity: number }> = []

    if (isNewFormat && dto.items) {
      // Новый формат - товары уже содержат всю информацию
      total = dto.totalPrice || 0
      productsForTelegram = dto.items.map(item => ({
        name: item.title,
        quantity: item.quantity,
      }))
    } else if (dto.products) {
      // Старый формат - ищем товары в БД
      const productIds = dto.products.map(p => p.productId)
      const { data: products, error: productsError } = await client.from('products').select('*').in('id', productIds)

      if (productsError || !products || products.length === 0) {
        throw new BadRequestException('Products not found')
      }

      productsForTelegram = dto.products.map(p => {
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
    }

    const orderData = {
      name,
      email,
      phone,
      address,
      delivery,
      payment,
      products: items,
      total,
      status: 'new',
    }

    // Insert order
    const { data: savedOrder, error: orderError } = await client.from('orders').insert([orderData]).select().single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Отправляем в Telegram
    await this.telegramService.sendOrderNotification({
      name,
      email,
      phone,
      address,
      delivery,
      payment,
      total,
      products: productsForTelegram,
      id: savedOrder.id,
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

    const { error } = await this.supabaseService.getClient().from('orders').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete order: ${error.message}`)
    }
  }
}
