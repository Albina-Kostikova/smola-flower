import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { Comment } from './comments.entity'

@Controller('/comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
  ) {}

  @Get(':noteId')
  async findByNoteId(@Param('noteId') noteId: string): Promise<Comment[]> {
    return this.commentsService.findByNoteId(noteId)
  }

  @Post()
  async create(
    @Body() body: { noteId: string; name: string; text: string; avatar_seed: string; is_owner: boolean },
  ): Promise<Comment> {
    const { noteId, ...commentData } = body
    const comment = await this.commentsService.create({ ...commentData, note_id: noteId })

    this.commentsService.sendNotification(noteId, commentData).catch(err => {
      console.error('Failed to send comment notification:', err)
    })

    return comment
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.commentsService.delete(id)
  }
}
