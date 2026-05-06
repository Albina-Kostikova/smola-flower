import { Module, forwardRef } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'
import { OrdersModule } from '../../modules/orders/orders.module'
import { ProductsModule } from '../../modules/products/products.module'
import { NotesModule } from '../../modules/notes/notes.module'

@Module({
  imports: [forwardRef(() => OrdersModule), forwardRef(() => ProductsModule), forwardRef(() => NotesModule)],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
