import { getAllLessons, getLessonById } from './lessons'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Lessons API', () => {
  const mockLessons = [
    {
      id: '1',
      title: 'Урок 1',
      description: 'Описание',
      content: 'Контент',
      imageUrl: '/img1.jpg',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Урок 2',
      description: 'Описание 2',
      content: 'Контент 2',
      imageUrl: '/img2.jpg',
      createdAt: '2024-01-02',
    },
  ]

  describe('getAllLessons', () => {
    it('fetches all lessons successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLessons,
      })

      const result = await getAllLessons()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/lessons'),
        expect.objectContaining({ next: { revalidate: 3600 } }),
      )
      expect(result).toEqual(mockLessons)
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      })

      await expect(getAllLessons()).rejects.toThrow('Failed to fetch lessons: Internal Server Error')
    })

    it('throws error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getAllLessons()).rejects.toThrow('Network error')
    })
  })

  describe('getLessonById', () => {
    it('fetches lesson by id successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLessons[0],
      })

      const result = await getLessonById('1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/lessons/1'),
        expect.objectContaining({ next: { revalidate: 86400 } }),
      )
      expect(result).toEqual(mockLessons[0])
    })

    it('throws 404 error when lesson not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(getLessonById('999')).rejects.toThrow('Lesson with id 999 not found')
    })

    it('throws error on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      })

      await expect(getLessonById('1')).rejects.toThrow('Failed to fetch lesson: Server Error')
    })
  })
})
