import { Injectable, NotFoundException } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { Note } from './notes.entity'

@Injectable()
export class NotesService {
  constructor(private supabaseService: SupabaseService) {}

  async createNote(noteData: Partial<Note>): Promise<Note> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notes')
      .insert([noteData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create note: ${error.message}`)
    }

    return data as Note
  }

  async getAllNotes(): Promise<Note[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`)
    }

    return (data || []) as Note[]
  }

  async getNoteById(id: string): Promise<Note> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw new NotFoundException(`Note with id ${id} not found`)
    }

    return data as Note
  }

  async updateNote(id: string, updateData: Partial<Note>): Promise<Note> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update note: ${error.message}`)
    }

    return data as Note
  }

  async deleteNote(id: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`)
    }
  }
}