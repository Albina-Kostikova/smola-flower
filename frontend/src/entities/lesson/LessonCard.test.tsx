import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LessonCard } from './LessonCard'
import type { Lesson } from './types'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

jest.mock('@/shared/ui/Buttons', () => ({
  PinkButton: ({ text, onClick }: { text: string; onClick?: () => void; className?: string }) => (
    <button onClick={onClick}>{text}</button>
  ),
}))

const mockLesson: Lesson = {
  id: '1',
  title: 'Test Lesson',
  description: 'This is a test lesson',
  img: '/lesson.jpg',
  price: 1500,
}

describe('LessonCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders lesson title', () => {
    render(<LessonCard lesson={mockLesson} />)

    expect(screen.getByText('Test Lesson')).toBeInTheDocument()
  })

  it('renders lesson description', () => {
    render(<LessonCard lesson={mockLesson} />)

    expect(screen.getByText('This is a test lesson')).toBeInTheDocument()
  })

  it('renders lesson price', () => {
    render(<LessonCard lesson={mockLesson} />)

    expect(screen.getByText(/1500/)).toBeInTheDocument()
  })

  it('renders buy button', () => {
    render(<LessonCard lesson={mockLesson} />)

    expect(screen.getByText('Купить')).toBeInTheDocument()
  })

  it('renders lesson image', () => {
    render(<LessonCard lesson={mockLesson} />)

    expect(screen.getByAltText('Test Lesson')).toBeInTheDocument()
  })

  it('navigates to lesson page when buy button clicked', async () => {
    const user = userEvent.setup()
    render(<LessonCard lesson={mockLesson} />)

    const buyButton = screen.getByText('Купить')
    await user.click(buyButton)

    expect(mockPush).toHaveBeenCalledWith('/lessons/1')
  })

  it('applies custom className', () => {
    const { container } = render(<LessonCard lesson={mockLesson} className="custom-class" />)

    const lessonDiv = container.firstChild
    expect(lessonDiv).toHaveClass('custom-class')
  })

  it('renders with correct structure', () => {
    const { container } = render(<LessonCard lesson={mockLesson} />)

    const lessonDiv = container.querySelector('div')
    expect(lessonDiv).toHaveClass('flex')
    expect(lessonDiv).toHaveClass('text-white')
  })
})
