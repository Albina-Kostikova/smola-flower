import { Test, TestingModule } from '@nestjs/testing'
import { LessonsService } from './lessons.service'
import { SupabaseService } from '../../database/supabase.service'
import { NotFoundException } from '@nestjs/common'
import { createSupabaseMock } from '@test/mocks/supabase.mock'
import { createQueryMock } from '@test/mocks/query-builder.mock'

describe('LessonsService', () => {
  let service: LessonsService
  let supabaseMock: ReturnType<typeof createSupabaseMock>

  const mockLesson = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Урок по созданию украшений',
    url: 'https://youtube.com/watch?v=123',
    description: 'Научитесь создавать красивые украшения своими руками',
    img: '/images/lesson-1.jpg',
    price: 5000,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  const mockLessons = [
    mockLesson,
    {
      ...mockLesson,
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Мастер-класс по бисероплетению',
      price: 3500,
    },
    {
      ...mockLesson,
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Урок "Заливка"',
      price: 0,
    },
  ]

  beforeEach(async () => {
    supabaseMock = createSupabaseMock()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: SupabaseService,
          useValue: supabaseMock.service,
        },
      ],
    }).compile()

    service = module.get<LessonsService>(LessonsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('should return all lessons', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockLessons, error: null }),
      )

      const result = await service.getAll()

      expect(result).toEqual(mockLessons)
      expect(result).toHaveLength(3)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('lessons')
    })

    it('should return empty array when no lessons', async () => {
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

      await expect(service.getAll()).rejects.toThrow('Failed to fetch lessons: DB error')
    })
  })

  describe('getById', () => {
    it('should return a lesson by id', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockLesson, error: null }),
      )

      const result = await service.getById(mockLesson.id)

      expect(result).toEqual(mockLesson)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('lessons')
    })

    it('should throw NotFoundException when lesson not found', async () => {
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
    it('should create and return a lesson', async () => {
      const newLesson = { ...mockLesson, id: 'new-id' }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: newLesson, error: null }),
      )

      const result = await service.create(newLesson)

      expect(result).toEqual(newLesson)
      expect(result.id).toBe('new-id')
    })

    it('should throw when creation fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Insert failed') }),
      )

      await expect(service.create(mockLesson)).rejects.toThrow(
        'Failed to create lessons: Insert failed',
      )
    })
  })

  describe('update', () => {
    it('should update and return a lesson', async () => {
      const updatedLesson = { ...mockLesson, price: 6000 }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: updatedLesson, error: null }),
      )

      const result = await service.update(mockLesson.id, { price: 6000 })

      expect(result).toEqual(updatedLesson)
      expect(result.price).toBe(6000)
    })

    it('should throw when update fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Update failed') }),
      )

      await expect(service.update('bad-id', {})).rejects.toThrow(
        'Failed to update lessons: Update failed',
      )
    })
  })

  describe('delete', () => {
    it('should delete a lesson', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: null }),
      )

      await expect(service.delete(mockLesson.id)).resolves.not.toThrow()
      expect(supabaseMock.client.from).toHaveBeenCalledWith('lessons')
    })

    it('should throw when deletion fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Delete failed') }),
      )

      await expect(service.delete('bad-id')).rejects.toThrow(
        'Failed to delete lessons: Delete failed',
      )
    })
  })
})