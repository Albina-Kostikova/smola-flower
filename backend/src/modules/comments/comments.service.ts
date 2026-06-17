import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { NotesService } from '../notes/notes.service'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { Comment } from './comments.entity'
import { BaseService } from '../../database/base.service'

@Injectable()
export class CommentsService extends BaseService<Comment> {
  constructor(
    supabaseService: SupabaseService,
    @Inject(forwardRef(() => NotesService))
    private notesService: NotesService,
    @Inject(forwardRef(() => TelegramService))
    private telegramService: TelegramService,
  ) {
    super(supabaseService, 'comments')
  }

  async sendNotification(noteId: string, commentData: { name?: string; text?: string }): Promise<void> {
    const note = await this.notesService.getById(noteId)
    await this.telegramService.sendCommentNotification({
      name: commentData.name || 'Аноним',
      text: commentData.text || '',
      noteTitle: note.title,
      noteId: noteId,
    })
  }

  async findCommentsByNoteId(noteId: string): Promise<Comment[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('comments')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`)
    }

    return (data || []) as Comment[]
  }
}