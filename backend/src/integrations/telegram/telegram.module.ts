import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'

import { OrdersModule } from '../../modules/orders/orders.module'
import { ProductsModule } from '../../modules/products/products.module'

@Module({
  imports: [OrdersModule, ProductsModule],
  providers: [TelegramService, TelegramUpdate],
})
export class TelegramModule {}