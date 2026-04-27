import { ProductService } from '../../../modules/products/products.service'

export class ProductsCommands {
  constructor(private productsService: ProductService) {}

  async add(ctx: any) {
    const [, data] = ctx.message?.text?.split('/add_product ') || []

    const [name, price, image] = data.split('|')

    await this.productsService.createProduct({
      id: Date.now().toString(),
      img: image,
      title: name,
      price: Number(price),
      technic: '',
      diameter: '',
      color: '',
      form: '',
      material: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ctx.reply('✅ Product added')
  }
}