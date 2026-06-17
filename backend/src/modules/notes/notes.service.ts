import { Injectable } from '@nestjs/common'
import { BaseService } from '../../database/base.service'
import { SupabaseService } from '../../database/supabase.service'
import { Note } from './notes.entity'

@Injectable()
export class NotesService extends BaseService<Note> {
  constructor(supabaseService: SupabaseService) {
    super(supabaseService, 'notes')
  }
}