import { Update, Start, Command, Ctx, Action } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { OrdersService } from '../../modules/orders/orders.service'
import { ProductService } from '../../modules/products/products.service'

@Update()
export class TelegramUpdate {
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(`
📦 Admin Panel

Команды:
/orders - все заказы
/products - все товары
`)
  }

  @Command('orders')
  async getOrders(@Ctx() ctx: Context) {
    const orders = await this.ordersService.findAll()

    const text = orders
      .map(o => `#${o.id} | ${o.name} | ${o.total}€ | ${o.status}`)
      .join('\n')

    await ctx.reply(text || 'Нет заказов')
  }

  @Command('products')
  async getProducts(@Ctx() ctx: Context) {
    const products = await this.productsService.findAll()

    const text = products
      .map((p: any) => `${p.id} | ${p.title} | ${p.price}€`)
      .join('\n')

    await ctx.reply(text || 'Нет товаров')
  }

  @Action(/order_shipped_(.+)/)
  async shipped(@Ctx() ctx: Context) {
    const id = (ctx as any).match?.[1]

    await this.ordersService.update(id, {
      status: 'shipped',
    })

    await ctx.reply(`🚚 Order ${id} shipped`)
  }

  @Action(/order_done_(.+)/)
  async done(@Ctx() ctx: Context) {
    const id = (ctx as any).match?.[1]

    await this.ordersService.update(id, {
      status: 'done',
    })

    await ctx.reply(`✅ Order ${id} done`)
  }

  @Action(/order_cancel_(.+)/)
  async cancel(@Ctx() ctx: Context) {
    const id = (ctx as any).match?.[1]

    await this.ordersService.update(id, {
      status: 'canceled',
    })

    await ctx.reply(`❌ Order ${id} canceled`)
  }
}