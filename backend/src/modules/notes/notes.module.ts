import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { NotesService } from './notes.service'
import { NotesController } from './notes.controller'

@Module({
  imports: [DatabaseModule],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}