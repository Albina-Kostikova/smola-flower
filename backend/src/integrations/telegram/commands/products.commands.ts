import { Command, Ctx } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { ProductsService } from '../../../modules/products/products.service'

export class ProductsCommands {
  constructor(private productsService: ProductsService) {}

  @Command('add_product')
  async add(@Ctx() ctx: Context) {
    const [, data] = ctx.message.text.split('/add_product ')

    const [name, price, image] = data.split('|')

    await this.productsService.create({
      name,
      price: Number(price),
      imageUrl: image,
      description: '',
    })

    await ctx.reply('✅ Product added')
  }
}