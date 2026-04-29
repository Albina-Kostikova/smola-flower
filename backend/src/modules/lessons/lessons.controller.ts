import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { Lesson } from './lessons.entity'

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonsService.getAllLessons()
  }

  @Get(':id')
  async getLessonById(@Param('id') id: string): Promise<Lesson> {
    return this.lessonsService.getLessonById(id)
  }

  @Post()
  async createLesson(@Body() lessonData: Lesson): Promise<Lesson> {
    return this.lessonsService.createLesson(lessonData)
  }
}
