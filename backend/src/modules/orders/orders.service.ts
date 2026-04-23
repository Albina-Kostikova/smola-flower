import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './order.entity'
import { Product } from '../products/products.entity'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,

    @InjectRepository(Product)
    private productsRepo: Repository<Product>,

    private telegramService: TelegramService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const productIds = dto.products.map(p => p.productId)

    const products = await this.productsRepo.find({
      where: { id: In(productIds) },
    })

    if (!products.length) {
      throw new BadRequestException('Products not found')
    }

    let total = 0

    const productsWithNames = dto.products.map(p => {
      const product = products.find(x => x.id === p.productId)

      if (!product) {
        throw new BadRequestException(`Product ${p.productId} not found`)
      }

      const itemTotal = Number(product.price) * p.quantity
      total += itemTotal

      return {
        name: product.name,
        quantity: p.quantity,
      }
    })

    const order = this.ordersRepo.create({
      ...dto,
      total,
      status: 'new',
    })

    const savedOrder = await this.ordersRepo.save(order)

    await this.telegramService.sendOrderNotification({
      ...dto,
      total,
      products: productsWithNames,
    })

    return savedOrder
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepo.find({
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { id } })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    return order
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const order = await this.findOne(id)

    Object.assign(order, data)

    return this.ordersRepo.save(order)
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id)

    await this.ordersRepo.remove(order)
  }
}