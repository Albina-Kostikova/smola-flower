import { getAllNotes, getNoteById } from './notes'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Notes API', () => {
  const mockNotes = [
    {
      id: '1',
      title: 'Заметка 1',
      content: 'Содержание заметки 1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Заметка 2',
      content: 'Содержание заметки 2',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
  ]

  describe('getAllNotes', () => {
    it('fetches all notes successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotes,
      })

      const result = await getAllNotes()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/notes'),
        expect.objectContaining({ next: { revalidate: 3600 } }),
      )
      expect(result).toEqual(mockNotes)
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      })

      await expect(getAllNotes()).rejects.toThrow('Failed to fetch notes: Internal Server Error')
    })

    it('throws error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getAllNotes()).rejects.toThrow('Network error')
    })
  })

  describe('getNoteById', () => {
    it('fetches note by id successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotes[0],
      })

      const result = await getNoteById('1')

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/notes/1'))
      expect(result).toEqual(mockNotes[0])
    })

    it('throws 404 error when note not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(getNoteById('999')).rejects.toThrow('Note with id 999 not found')
    })

    it('throws error on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      })

      await expect(getNoteById('1')).rejects.toThrow('Failed to fetch notes: Server Error')
    })
  })
})
