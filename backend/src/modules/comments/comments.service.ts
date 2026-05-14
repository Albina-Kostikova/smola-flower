import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { NotesService } from '../notes/notes.service'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { Comment } from './comments.entity'

@Injectable()
export class CommentsService {
  constructor(
    private supabaseService: SupabaseService,
    @Inject(forwardRef(() => NotesService))
    private notesService: NotesService,
    @Inject(forwardRef(() => TelegramService))
    private telegramService: TelegramService,
  ) {}

  async create(commentData: Partial<Comment>): Promise<Comment> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('comments')
      .insert([commentData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create comment: ${error.message}`)
    }

    return data as Comment
  }

  async sendNotification(noteId: string, commentData: { name?: string; text?: string }): Promise<void> {
    const note = await this.notesService.findOne(noteId)
    await this.telegramService.sendCommentNotification({
      name: commentData.name || 'Аноним',
      text: commentData.text || '',
      noteTitle: note.title,
      noteId: noteId,
    })
  }

  async findByNoteId(noteId: string): Promise<Comment[]> {
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

  async findAll(): Promise<Comment[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`)
    }

    return (data || []) as Comment[]
  }

  async findOne(id: string): Promise<Comment> {
    const { data, error } = await this.supabaseService.getClient().from('comments').select('*').eq('id', id).single()

    if (error || !data) {
      throw new NotFoundException(`Comment with id ${id} not found`)
    }

    return data as Comment
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseService.getClient().from('comments').delete().eq('id', id)

    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`)
    }
  }
}
