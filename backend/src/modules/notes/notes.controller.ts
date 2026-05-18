import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common'
import { NotesService } from './notes.service'
import { Note } from './notes.entity'

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  async getAllNotes(): Promise<Note[]> {
    return this.notesService.getAllNotes()
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string): Promise<Note> {
    return this.notesService.getNoteById(id)
  }

  @Post()
  async createNote(@Body() noteData: Partial<Note>): Promise<Note> {
    return this.notesService.createNote(noteData)
  }

  @Patch(':id')
  async updateNote(@Param('id') id: string, @Body() updateData: Partial<Note>): Promise<Note> {
    return this.notesService.updateNote(id, updateData)
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string): Promise<void> {
    return this.notesService.deleteNote(id)
  }
}