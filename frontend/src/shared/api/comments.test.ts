import { getCommentsByNoteId, createComment } from './comments'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Comments API', () => {
  const mockComments = [
    {
      id: '1',
      noteId: '1',
      text: 'Отличная статья!',
      author: 'Иван',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      noteId: '1',
      text: 'Спасибо за информацию',
      author: 'Мария',
      createdAt: '2024-01-02',
    },
  ]

  describe('getCommentsByNoteId', () => {
    it('fetches comments by note id successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockComments,
      })

      const result = await getCommentsByNoteId('1')

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/comments/1'))
      expect(result).toEqual(mockComments)
    })

    it('returns empty array when no comments found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const result = await getCommentsByNoteId('999')

      expect(result).toEqual([])
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      })

      await expect(getCommentsByNoteId('1')).rejects.toThrow('Failed to fetch comments: Internal Server Error')
    })

    it('throws error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getCommentsByNoteId('1')).rejects.toThrow('Network error')
    })
  })

  describe('createComment', () => {
    const commentData = {
      name: 'Петр',
      avatar_seed: 'alex.jpg',
      text: 'Новый комментарий',
      is_owner: false,
    }

    it('creates comment successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '3', note_id: '1', ...commentData, created_at: '2024-01-03' }),
      })

      const result = await createComment('1', commentData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/comments'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('note_id', '1')
    })

    it('throws error when comment creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      })

      await expect(createComment('1', commentData)).rejects.toThrow('Failed to create comment: Bad Request')
    })

    it('throws error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(createComment('1', commentData)).rejects.toThrow('Network error')
    })
  })
})
