import { render, screen } from '@testing-library/react'
import { ArticleCard } from './ArticleCard'
import type { Note } from '@/entities/note'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

const mockNote: Note = {
  id: '1',
  title: 'Test Article',
  text: 'This is a test article content',
  img: '/article.jpg',
  date: new Date('2024-01-15'),
  created_at: new Date('2024-01-15'),
}

describe('ArticleCard', () => {
  it('renders "Статья не найдена" when note is null', () => {
    render(<ArticleCard note={null} />)

    expect(screen.getByText('Статья не найдена')).toBeInTheDocument()
  })

  it('renders article title', () => {
    render(<ArticleCard note={mockNote} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
  })

  it('renders article content', () => {
    render(<ArticleCard note={mockNote} />)

    expect(screen.getByText('This is a test article content')).toBeInTheDocument()
  })

  it('renders article image', () => {
    render(<ArticleCard note={mockNote} />)

    expect(screen.getByAltText('Test Article')).toBeInTheDocument()
  })

  it('displays formatted date', () => {
    render(<ArticleCard note={mockNote} />)

    const dateElement = screen.getByText(/15 января 2024/)
    expect(dateElement).toBeInTheDocument()
  })

  it('renders article with correct structure', () => {
    const { container } = render(<ArticleCard note={mockNote} />)

    const article = container.querySelector('article')
    expect(article).toHaveClass('bg-white', 'rounded-2xl', 'shadow-lg')
  })

  it('displays image with correct alt text', () => {
    render(<ArticleCard note={mockNote} />)

    const image = screen.getByAltText('Test Article')
    expect(image).toHaveAttribute('src', '/article.jpg')
  })

  it('renders with different content', () => {
    const differentNote: Note = {
      id: '2',
      title: 'Another Article',
      text: 'Different content here',
      img: '/another.jpg',
      date: new Date('2024-02-01'),
      created_at: new Date('2024-02-01'),
    }

    render(<ArticleCard note={differentNote} />)

    expect(screen.getByText('Another Article')).toBeInTheDocument()
    expect(screen.getByText('Different content here')).toBeInTheDocument()
    expect(screen.getByAltText('Another Article')).toBeInTheDocument()
  })

  it('handles long article text correctly', () => {
    const longText = 'A'.repeat(500)
    const noteWithLongText: Note = {
      ...mockNote,
      text: longText,
    } as Note

    render(<ArticleCard note={noteWithLongText} />)

    expect(screen.getByText(longText)).toBeInTheDocument()
  })
})
