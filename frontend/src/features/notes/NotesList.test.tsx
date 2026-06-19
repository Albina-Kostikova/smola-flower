import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotesList } from './NotesList'
import type { Note } from '@/entities/note'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

jest.mock('@/shared/ui/Buttons', () => ({
  InfoButton: ({ text }: { text: string; className?: string }) => <button>{text}</button>,
}))

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Note 1',
    text: 'First note content',
    img: '/note1.jpg',
    date: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Note 2',
    text: 'Second note content',
    img: '/note2.jpg',
    date: new Date('2024-01-02'),
    created_at: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Note 3',
    text: 'Third note content',
    img: '/note3.jpg',
    date: new Date('2024-01-03'),
    created_at: new Date('2024-01-03'),
  },
]

describe('NotesList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders header "Другие статьи"', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    expect(screen.getByText('Другие статьи')).toBeInTheDocument()
  })

  it('renders all notes except current one', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    expect(screen.getByText('Note 2')).toBeInTheDocument()
    expect(screen.getByText('Note 3')).toBeInTheDocument()
    expect(screen.queryByText('Note 1')).not.toBeInTheDocument()
  })

  it('displays note titles', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    expect(screen.getByText('Note 2')).toBeInTheDocument()
    expect(screen.getByText('Note 3')).toBeInTheDocument()
  })

  it('displays note content preview', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    expect(screen.getByText('Second note content')).toBeInTheDocument()
    expect(screen.getByText('Third note content')).toBeInTheDocument()
  })

  it('displays formatted dates', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    expect(screen.getByText(/2 января 2024/)).toBeInTheDocument()
    expect(screen.getByText(/3 января 2024/)).toBeInTheDocument()
  })

  it('calls onNoteSelect when note is clicked', async () => {
    const user = userEvent.setup()
    const onNoteSelect = jest.fn()

    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={onNoteSelect} />)

    const note2Element = screen.getByText('Note 2')
    const noteContainer = note2Element.closest('div')
    if (noteContainer) {
      await user.click(noteContainer)
    }

    expect(onNoteSelect).toHaveBeenCalledWith('2')
  })

  it('renders note images', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    expect(screen.getByAltText('Note 2')).toBeInTheDocument()
    expect(screen.getByAltText('Note 3')).toBeInTheDocument()
  })

  it('shows other notes when available', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    expect(screen.getAllByText('Note 2').length).toBeGreaterThan(0)
  })

  it('renders "Продолжить чтение" button', () => {
    render(<NotesList notes={mockNotes} currentNoteId="1" onNoteSelect={jest.fn()} />)

    const buttons = screen.getAllByText('Продолжить чтение')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
