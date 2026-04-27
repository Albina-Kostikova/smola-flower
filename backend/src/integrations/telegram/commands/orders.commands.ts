import { OrdersService } from '../../../modules/orders/orders.service'

export class OrdersCommands {
  constructor(private ordersService: OrdersService) {}

  async list(ctx: any) {
    const orders = await this.ordersService.findAll()

    const text = orders
      .map(o => `${o.id} | ${o.status} | ${o.total}€`)
      .join('\n')

    await ctx.reply(text)
  }
}