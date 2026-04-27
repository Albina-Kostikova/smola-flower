import { Module } from '@nestjs/common'
import { ProductService } from './products.service'
import { ProductsController } from './products.controller'
import { DatabaseModule } from '../../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [ProductService],
  controllers: [ProductsController],
  exports: [ProductService],
})
export class ProductsModule {}
