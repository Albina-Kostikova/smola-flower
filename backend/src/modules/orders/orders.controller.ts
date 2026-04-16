import { Controller, Post, Body } from '@nestjs/common'
import { CrerateOrderDto } from './dto/create-order.dto'
import { OrdersService } from './orders.service'
import { Order } from './orders.entity'
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}  

  @Post()
  async createOrder(@Body() orderData: CrerateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(orderData)
  }
}