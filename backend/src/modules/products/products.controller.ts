import { Controller, Get, Post } from '@nestjs/common'
import { Body, Param } from '@nestjs/common'
import { ProductService } from './products.service'
import { Product } from './products.entity'
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts()
  }
  @Get(':uuid')
  async getProductById(@Param('uuid') uuid: string): Promise<Product> {
    return this.productService.getProductById(uuid)
  }

  @Post()
  async createProduct(@Body() productData: Product): Promise<Product> {
    return this.productService.createProduct(productData)
  }
}
