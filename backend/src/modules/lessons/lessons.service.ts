import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../../database/supabase.service'
import { Lesson } from './lessons.entity'

@Injectable()
export class LessonsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllLessons(): Promise<Lesson[]> {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase.from('lessons').select('*')

    if (error) {
      throw new Error(`Failed to fetch lessons: ${error.message}`)
    }

    return data || []
  }

  async getLessonById(id: string): Promise<Lesson> {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch lesson: ${error.message}`)
    }

    return data
  }

  async createLesson(lessonData: Lesson): Promise<Lesson> {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('lessons')
      .insert([lessonData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create lesson: ${error.message}`)
    }

    return data
  }
  async updateLesson(id: string, lessonData: Lesson) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('lessons')
      .update(lessonData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update lesson: ${error.message}`)
    }

    return data
  }
  async deleteLesson(id: string) {
    const { error } = await this.supabaseService.getClient()
    .from('lessons')
    .delete()
    .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete lesson: ${error.message}`)
    }
    
  }
}
