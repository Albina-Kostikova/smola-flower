import { Module, forwardRef } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'
import { OrdersModule } from '../../modules/orders/orders.module'
import { ProductsModule } from '../../modules/products/products.module'
import { NotesModule } from '../../modules/notes/notes.module'

import { LessonsModule } from '../../modules/lessons/lessons.module'

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => NotesModule),
    forwardRef(() => LessonsModule),
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
