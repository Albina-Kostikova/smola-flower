import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GallerySection } from './GallerySection'
import type { GalleryImage } from './types'

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
  PinkButton: ({ text, onClick }: { text: string; onClick?: () => void }) => <button onClick={onClick}>{text}</button>,
}))

const mockImages: GalleryImage[] = [
  { url: '/image1.jpg', title: 'Image 1', productId: '1' },
  { url: '/image2.jpg', title: 'Image 2', productId: '2' },
  { url: '/image3.jpg', title: 'Image 3', productId: '3' },
]

describe('GallerySection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all gallery images', () => {
    render(<GallerySection images={mockImages} />)

    expect(screen.getByAltText('Image 1')).toBeInTheDocument()
    expect(screen.getByAltText('Image 2')).toBeInTheDocument()
    expect(screen.getByAltText('Image 3')).toBeInTheDocument()
  })

  it('shows active image details when image is clicked', async () => {
    const user = userEvent.setup()
    render(<GallerySection images={mockImages} />)

    const image = screen.getByAltText('Image 1')
    await user.click(image)

    expect(screen.getAllByText('Image 1').length).toBeGreaterThan(0)
  })

  it('shows close button when image is active', async () => {
    const user = userEvent.setup()
    render(<GallerySection images={mockImages} />)

    const image = screen.getByAltText('Image 1')
    await user.click(image)

    expect(screen.getAllByText('✕').length).toBeGreaterThan(0)
  })

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<GallerySection images={mockImages} />)

    const image = screen.getByAltText('Image 1')
    await user.click(image)

    const closeButtons = screen.getAllByText('✕')
    await user.click(closeButtons[0])

    expect(screen.queryAllByText('✕').length).toBe(0)
  })

  it('shows "Перейти к товару" button in active view', async () => {
    const user = userEvent.setup()
    render(<GallerySection images={mockImages} />)

    const image = screen.getByAltText('Image 1')
    await user.click(image)

    expect(screen.getAllByText('Перейти к товару').length).toBeGreaterThan(0)
  })

  it('navigates to product page when button is clicked', async () => {
    const user = userEvent.setup()
    render(<GallerySection images={mockImages} />)

    const image = screen.getByAltText('Image 1')
    await user.click(image)

    const buttons = screen.getAllByText('Перейти к товару')
    await user.click(buttons[0])

    expect(mockPush).toHaveBeenCalledWith('/catalog/1')
  })

  it('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<GallerySection images={mockImages} />)

    const image = screen.getByAltText('Image 1')
    await user.click(image)

    const closeButtons = screen.getAllByText('✕')
    await user.click(closeButtons[0])

    expect(screen.queryAllByText('✕').length).toBe(0)
  })

  it('renders with empty images array', () => {
    const { container } = render(<GallerySection images={[]} />)

    const columnLayout = container.querySelector('.columns-2')
    expect(columnLayout).toBeInTheDocument()
  })
})
