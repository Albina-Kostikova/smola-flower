import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './order.entity'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(dto)
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.getAllOrders()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrderById(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<Order>,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.deleteOrder(id)
  }
}