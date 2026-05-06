import { Controller, Get, Param, Post, Body, Delete, Inject, forwardRef } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { NotesService } from '../notes/notes.service'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { Comment } from './comments.entity'

@Controller('notes/:noteId/comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    @Inject(forwardRef(() => NotesService))
    private notesService: NotesService,
    private telegramService: TelegramService,
  ) {}

  @Get()
  async findByNoteId(@Param('noteId') noteId: string): Promise<Comment[]> {
    return this.commentsService.findByNoteId(noteId)
  }

  @Post()
  async create(@Param('noteId') noteId: string, @Body() commentData: Partial<Comment>): Promise<Comment> {
    const comment = await this.commentsService.create({ ...commentData, note_id: noteId })

    try {
      const note = await this.notesService.findOne(noteId)
      await this.telegramService.sendCommentNotification({
        name: commentData.name || 'Аноним',
        text: commentData.text || '',
        noteTitle: note.title,
        noteId: noteId,
      })
    } catch (err) {
      console.error('Failed to send comment notification:', err)
    }

    return comment
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.commentsService.delete(id)
  }
}
