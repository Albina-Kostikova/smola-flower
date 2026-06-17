import { Injectable, BadRequestException } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './order.entity'
import { BaseService } from '../../database/base.service'

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
}

@Injectable()
export class OrdersService extends BaseService<Order> {
  constructor(
    supabaseService: SupabaseService,
    private telegramService: TelegramService,
  ) {
    super(supabaseService, 'orders')
  }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const client = this.supabaseService.getClient()

    const { customer, delivery = 'unknown', payment = 'unknown' } = dto
    if (!customer) {
      throw new BadRequestException('Missing customer data')
    }
    const { fio: name, email, phone, address = 'не указан' } = customer

    const isCart = !!dto.items && dto.items.length > 0
    const isLesson = !!dto.item

    if (!isCart && !isLesson) {
      throw new BadRequestException('Missing items or item data')
    }
    
    let items: OrderItem[] = []
    let total = 0
    let productsForTelegram: Array<{ name: string; quantity: number }> = []

    if (isCart) {
      items = dto.items!.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }))
      total = dto.totalPrice || items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      productsForTelegram = items.map(item => ({
        name: item.title,
        quantity: item.quantity,
      }))
    } else if (isLesson) {
      const { id, title, price } = dto.item!
      items = [{ id, title, price, quantity: 1 }]
      total = price
      productsForTelegram = [{ name: title, quantity: 1 }]
    }

    const orderData = {
      name,
      email,
      phone,
      address,
      delivery: isLesson ? 'lesson' : delivery,
      payment: isLesson ? 'lesson' : payment,
      total,
      status: 'new',
    }

    const { data: savedOrder, error: orderError } = await client
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    if (items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: savedOrder.id,
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
        title: item.title,
      }))

      const { error: itemsError } = await client.from('order-items').insert(orderItems)

      if (itemsError) {
        console.error('Failed to save order items:', itemsError)
      }
    }

    await this.telegramService.sendOrderNotification({
      name,
      email,
      phone,
      address,
      delivery: isLesson ? 'Урок' : delivery,
      payment: isLesson ? 'Оплата урока' : payment,
      total,
      products: productsForTelegram,
      id: savedOrder.id,
    })

    return savedOrder as Order
  }
}