import { OrdersService } from '../../../modules/orders/orders.service'
import { Order } from '../../../modules/orders/order.entity'

export class OrdersCommands {
  constructor(private ordersService: OrdersService) {}

  async list(ctx: any) {
    const orders: Order[] = await this.ordersService.getAllOrders()

    const text = orders.map((o: Order) => `${o.id} | ${o.status} | ${o.total}€`).join('\n')

    await ctx.reply(text)
  }
}
