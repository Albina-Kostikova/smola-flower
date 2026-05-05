import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { ProductsModule } from './modules/products/products.module'
import { LessonsModule } from './modules/lessons/lessons.module'
import { OrdersModule } from './modules/orders/orders.module'
import { TelegramModule } from './integrations/telegram/telegram.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProductsModule,
    LessonsModule,
    OrdersModule,
    TelegramModule,
  ],
})
export class AppModule {}
