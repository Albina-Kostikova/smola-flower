import { Test, TestingModule } from '@nestjs/testing'
import { CommentsService } from './comments.service'
import { NotesService } from '../notes/notes.service'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { SupabaseService } from '../../database/supabase.service'
import { NotFoundException } from '@nestjs/common'
import { createSupabaseMock } from '@test/mocks/supabase.mock'
import { createQueryMock } from '@test/mocks/query-builder.mock'

describe('CommentsService', () => {
  let service: CommentsService
  let supabaseMock: ReturnType<typeof createSupabaseMock>
  let notesServiceMock: { getById: jest.Mock }
  let telegramServiceMock: { sendCommentNotification: jest.Mock }

  const mockComment = {
    id: 'comment-1',
    note_id: 'note-1',
    name: 'Анна',
    avatar_seed: 'anna123',
    text: 'Отличная статья! Спасибо!',
    is_owner: false,
    created_at: new Date('2025-01-15'),
  }

  const mockComments = [
    mockComment,
    {
      ...mockComment,
      id: 'comment-2',
      name: 'Мария',
      avatar_seed: 'maria456',
      text: 'Очень полезная информация',
      created_at: new Date('2025-01-16'),
    },
    {
      ...mockComment,
      id: 'comment-3',
      name: 'Елена',
      avatar_seed: 'elena789',
      text: 'Буду пробовать!',
      created_at: new Date('2025-01-17'),
    },
  ]

  const mockNote = {
    id: 'note-1',
    title: 'Как выбрать украшение',
    img: '/images/note-1.jpg',
    date: new Date('2025-01-15'),
    text: 'Полезные советы...',
    created_at: new Date('2025-01-15'),
  }

  beforeEach(async () => {
    supabaseMock = createSupabaseMock()
    notesServiceMock = {
      getById: jest.fn().mockResolvedValue(mockNote),
    }
    telegramServiceMock = {
      sendCommentNotification: jest.fn().mockResolvedValue(undefined),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: SupabaseService,
          useValue: supabaseMock.service,
        },
        {
          provide: NotesService,
          useValue: notesServiceMock,
        },
        {
          provide: TelegramService,
          useValue: telegramServiceMock,
        },
      ],
    }).compile()

    service = module.get<CommentsService>(CommentsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create (из BaseService)', () => {
    it('should create and return a comment', async () => {
      const newComment = { ...mockComment, id: 'new-comment' }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: newComment, error: null }),
      )

      const result = await service.create(newComment)

      expect(result).toEqual(newComment)
      expect(result.id).toBe('new-comment')
      expect(supabaseMock.client.from).toHaveBeenCalledWith('comments')
    })

    it('should throw when creation fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Insert failed') }),
      )

      await expect(service.create(mockComment)).rejects.toThrow(
        'Failed to create comments: Insert failed',
      )
    })
  })

  describe('getAll (из BaseService)', () => {
    it('should return all comments', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockComments, error: null }),
      )

      const result = await service.getAll()

      expect(result).toEqual(mockComments)
      expect(result).toHaveLength(3)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('comments')
    })

    it('should return empty array when no comments', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: [], error: null }),
      )

      const result = await service.getAll()

      expect(result).toEqual([])
    })

    it('should throw when fetch fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('DB error') }),
      )

      await expect(service.getAll()).rejects.toThrow(
        'Failed to fetch comments: DB error',
      )
    })
  })

  describe('getById (из BaseService)', () => {
    it('should return a comment by id', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockComment, error: null }),
      )

      const result = await service.getById('comment-1')

      expect(result).toEqual(mockComment)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('comments')
    })

    it('should throw NotFoundException when comment not found', async () => {
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

  describe('update', () => {
    it('should update and return a comment', async () => {
      const updatedComment = { ...mockComment, text: 'Обновлённый текст' }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: updatedComment, error: null }),
      )

      const result = await service.update('comment-1', { text: 'Обновлённый текст' })

      expect(result).toEqual(updatedComment)
      expect(result.text).toBe('Обновлённый текст')
    })

    it('should throw when update fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Update failed') }),
      )

      await expect(service.update('bad-id', {})).rejects.toThrow(
        'Failed to update comments: Update failed',
      )
    })
  })

  describe('delete', () => {
    it('should delete a comment', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: null }),
      )

      await expect(service.delete('comment-1')).resolves.not.toThrow()
      expect(supabaseMock.client.from).toHaveBeenCalledWith('comments')
    })

    it('should throw when deletion fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Delete failed') }),
      )

      await expect(service.delete('bad-id')).rejects.toThrow(
        'Failed to delete comments: Delete failed',
      )
    })
  })

  describe('findCommentsByNoteId (уникальный)', () => {
    it('should return comments for a note', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockComments, error: null }),
      )

      const result = await service.findCommentsByNoteId('note-1')

      expect(result).toEqual(mockComments)
      expect(result).toHaveLength(3)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('comments')
    })

    it('should return empty array when no comments', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: [], error: null }),
      )

      const result = await service.findCommentsByNoteId('note-without-comments')

      expect(result).toEqual([])
    })

    it('should throw when fetch fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('DB error') }),
      )

      await expect(service.findCommentsByNoteId('note-1')).rejects.toThrow(
        'Failed to fetch comments: DB error',
      )
    })

    it('should order by created_at ascending', async () => {
      const queryMock = createQueryMock({ data: mockComments, error: null })
      supabaseMock.client.from.mockReturnValue(queryMock)

      await service.findCommentsByNoteId('note-1')

      expect(queryMock.order).toHaveBeenCalledWith('created_at', {
        ascending: true,
      })
    })
  })

  describe('sendNotification', () => {
    it('should send notification with comment data', async () => {
      await service.sendNotification('note-1', {
        name: 'Анна',
        text: 'Отличная статья!',
      })

      expect(notesServiceMock.getById).toHaveBeenCalledWith('note-1')
      expect(telegramServiceMock.sendCommentNotification).toHaveBeenCalledWith({
        name: 'Анна',
        text: 'Отличная статья!',
        noteTitle: mockNote.title,
        noteId: 'note-1',
      })
    })

    it('should use default name "Аноним" when name not provided', async () => {
      await service.sendNotification('note-1', {
        text: 'Текст комментария',
      })

      expect(telegramServiceMock.sendCommentNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Аноним',
        }),
      )
    })

    it('should throw error when note not found', async () => {
      notesServiceMock.getById.mockRejectedValue(
        new NotFoundException('notes with id not-found not found'),
      )

      await expect(
        service.sendNotification('not-found', { name: 'Тест', text: 'Тест' }),
      ).rejects.toThrow()
    })
  })
})