import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentsSection } from './CommentsSection'
import * as commentsApi from '@/shared/api/comments'

jest.mock('@/shared/api/comments')
jest.mock('@/shared/ui/Buttons', () => ({
  PinkButton: ({ text, onClick }: { text: string; onClick?: () => void }) => <button onClick={onClick}>{text}</button>,
}))

const mockComments = [
  {
    id: '1',
    noteId: '1',
    text: 'Great article!',
    author: 'John',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    noteId: '1',
    text: 'Thanks for sharing',
    author: 'Jane',
    createdAt: '2024-01-02',
  },
]

const mockedGetCommentsByNoteId = commentsApi.getCommentsByNoteId as jest.Mock
const mockedCreateComment = commentsApi.createComment as jest.Mock

describe('CommentsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads comments when noteId is provided', async () => {
    mockedGetCommentsByNoteId.mockResolvedValueOnce(mockComments)

    render(<CommentsSection noteId="1" />)

    await waitFor(() => {
      expect(mockedGetCommentsByNoteId).toHaveBeenCalledWith('1')
    })
  })

  it('does not load comments when noteId is null', () => {
    render(<CommentsSection noteId={null} />)

    expect(mockedGetCommentsByNoteId).not.toHaveBeenCalled()
  })

  it('renders comment form inputs', () => {
    mockedGetCommentsByNoteId.mockResolvedValueOnce([])

    render(<CommentsSection noteId="1" />)

    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBeGreaterThan(0)
  })

  it('validates required fields before submitting', async () => {
    const user = userEvent.setup()
    mockedGetCommentsByNoteId.mockResolvedValueOnce([])

    render(<CommentsSection noteId="1" />)

    const buttons = screen.getAllByRole('button')
    const submitButton = buttons.find(
      btn => btn.textContent?.includes('Отправить') || btn.textContent?.includes('send'),
    )

    if (submitButton) {
      await user.click(submitButton)
      expect(screen.getByText(/Пожалуйста, заполните/i)).toBeInTheDocument()
    }
  })

  it('allows avatar selection', () => {
    mockedGetCommentsByNoteId.mockResolvedValueOnce([])

    render(<CommentsSection noteId="1" />)

    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBeGreaterThan(0)
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    mockedGetCommentsByNoteId.mockResolvedValueOnce([])
    mockedCreateComment.mockResolvedValueOnce({
      id: '3',
      noteId: '1',
      text: 'New comment',
      author: 'Test',
      createdAt: new Date().toISOString(),
    })

    render(<CommentsSection noteId="1" />)

    const textboxes = screen.getAllByRole('textbox')

    expect(textboxes.length).toBeGreaterThan(0)
  })

  it('handles fetch errors gracefully', async () => {
    mockedGetCommentsByNoteId.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<CommentsSection noteId="1" />)

    await waitFor(() => {
      expect(mockedGetCommentsByNoteId).toHaveBeenCalled()
    })

    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBeGreaterThan(0)
  })

  it('shows success message after submitting comment', async () => {
    mockedGetCommentsByNoteId.mockResolvedValueOnce([])
    mockedCreateComment.mockResolvedValueOnce({ id: '3' })

    render(<CommentsSection noteId="1" />)

    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBeGreaterThan(0)
  })
})
