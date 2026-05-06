import { Module, forwardRef } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { TelegramModule } from '../../integrations/telegram/telegram.module'
import { NotesModule } from '../notes/notes.module'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'

@Module({
  imports: [DatabaseModule, forwardRef(() => TelegramModule), forwardRef(() => NotesModule)],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
