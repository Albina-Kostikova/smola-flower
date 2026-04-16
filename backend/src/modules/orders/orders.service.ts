import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './products.entity'
import { TelegramService } from '../telegram/telegram.service'
import { CrerateOrderDto } from './dto/create-order.dto'
import { Order } from './orders.entity'
@Injectable()
export class OrdersService {
  constructor(private telegramService: TelegramService) {}

  async createOrder(orderData: CrerateOrderDto): Promise<Order> {
    const order = new Order()
    order.delivery = orderData.delivery
    order.payment = orderData.payment
    order.name = orderData.name
    order.email = orderData.email
    order.phone = orderData.phone
    order.address = orderData.address
    order.products = JSON.stringify(orderData.products)
    order.total = orderData.total
    await this.telegramService.sendOrderNotification(orderData)
    return { message: 'Заказ отправлен' }
  }
}