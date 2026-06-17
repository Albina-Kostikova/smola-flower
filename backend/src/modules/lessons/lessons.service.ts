import { Injectable } from '@nestjs/common'
import { BaseService } from '../../database/base.service'
import { SupabaseService } from '../../database/supabase.service'
import { Lesson } from './lessons.entity'

@Injectable()
export class LessonsService extends BaseService<Lesson> {
  constructor(supabaseService: SupabaseService) {
    super(supabaseService, 'lessons')
  }
}