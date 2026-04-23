import { Command, Ctx } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { OrdersService } from '../../../modules/orders/orders.service'

export class OrdersCommands {
  constructor(private ordersService: OrdersService) {}

  @Command('orders_list')
  async list(@Ctx() ctx: Context) {
    const orders = await this.ordersService.findAll()

    const text = orders
      .map(o => `${o.id} | ${o.status} | ${o.total}€`)
      .join('\n')

    await ctx.reply(text)
  }
}