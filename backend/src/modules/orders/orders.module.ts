import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { DatabaseModule } from '../../database/database.module'
import { TelegramModule } from '../../integrations/telegram/telegram.module'

@Module({
  imports: [DatabaseModule, TelegramModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
