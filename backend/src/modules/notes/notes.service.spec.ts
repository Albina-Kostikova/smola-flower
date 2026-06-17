import { Test, TestingModule } from '@nestjs/testing'
import { NotesService } from './notes.service'
import { SupabaseService } from '../../database/supabase.service'
import { NotFoundException } from '@nestjs/common'
import { createSupabaseMock } from '@test/mocks/supabase.mock'
import { createQueryMock } from '@test/mocks/query-builder.mock'

describe('NotesService', () => {
  let service: NotesService
  let supabaseMock: ReturnType<typeof createSupabaseMock>

  const mockNote = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Как выбрать украшение',
    img: '/images/note-1.jpg',
    date: new Date('2025-01-15'),
    text: 'Полезные советы по выбору украшений...',
    created_at: new Date('2025-01-15'),
  }

  const mockNotes = [
    mockNote,
    {
      ...mockNote,
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Уход за серебряными изделиями',
      text: 'Как правильно чистить серебро...',
    },
    {
      ...mockNote,
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Модные тенденции 2025',
      text: 'Какие украшения в тренде...',
    },
  ]

  beforeEach(async () => {
    supabaseMock = createSupabaseMock()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: SupabaseService,
          useValue: supabaseMock.service,
        },
      ],
    }).compile()

    service = module.get<NotesService>(NotesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('should return all notes', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockNotes, error: null }),
      )

      const result = await service.getAll()

      expect(result).toEqual(mockNotes)
      expect(result).toHaveLength(3)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('notes')
    })

    it('should return empty array when no notes', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: [], error: null }),
      )

      const result = await service.getAll()

      expect(result).toEqual([])
    })

    it('should throw when Supabase fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('DB error') }),
      )

      await expect(service.getAll()).rejects.toThrow('Failed to fetch notes: DB error')
    })

    it('should order by created_at descending by default', async () => {
      const queryMock = createQueryMock({ data: mockNotes, error: null })
      supabaseMock.client.from.mockReturnValue(queryMock)

      await service.getAll()

      expect(queryMock.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      })
    })
  })

  describe('getById', () => {
    it('should return a note by id', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockNote, error: null }),
      )

      const result = await service.getById(mockNote.id)

      expect(result).toEqual(mockNote)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('notes')
    })

    it('should throw NotFoundException when note not found', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: null }),
      )

      await expect(service.getById('non-existent')).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw NotFoundException when query errors', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('DB error') }),
      )

      await expect(service.getById('bad-id')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('create', () => {
    it('should create and return a note', async () => {
      const newNote = { ...mockNote, id: 'new-id' }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: newNote, error: null }),
      )

      const result = await service.create(newNote)

      expect(result).toEqual(newNote)
      expect(result.id).toBe('new-id')
    })

    it('should throw when creation fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Insert failed') }),
      )

      await expect(service.create(mockNote)).rejects.toThrow(
        'Failed to create notes: Insert failed',
      )
    })
  })

  describe('update', () => {
    it('should update and return a note', async () => {
      const updatedNote = { ...mockNote, title: 'Обновлённый заголовок' }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: updatedNote, error: null }),
      )

      const result = await service.update(mockNote.id, { title: 'Обновлённый заголовок' })

      expect(result).toEqual(updatedNote)
      expect(result.title).toBe('Обновлённый заголовок')
    })

    it('should throw when update fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Update failed') }),
      )

      await expect(service.update('bad-id', {})).rejects.toThrow(
        'Failed to update notes: Update failed',
      )
    })
  })

  describe('delete', () => {
    it('should delete a note', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: null }),
      )

      await expect(service.delete(mockNote.id)).resolves.not.toThrow()
      expect(supabaseMock.client.from).toHaveBeenCalledWith('notes')
    })

    it('should throw when deletion fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Delete failed') }),
      )

      await expect(service.delete('bad-id')).rejects.toThrow(
        'Failed to delete notes: Delete failed',
      )
    })
  })
})