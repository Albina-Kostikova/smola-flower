import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common'
import { NotesService } from './notes.service'
import { Note } from './notes.entity'

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(id)
  }

  @Post()
  async create(@Body() noteData: Partial<Note>): Promise<Note> {
    return this.notesService.create(noteData)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Note>): Promise<Note> {
    return this.notesService.update(id, updateData)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.notesService.delete(id)
  }
}