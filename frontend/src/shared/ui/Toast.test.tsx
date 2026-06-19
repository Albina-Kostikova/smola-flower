import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from './Toast'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props

    return <img {...rest} />
  },
}))

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders toast message when visible', () => {
    render(<Toast message="Test message" isVisible={true} onClose={jest.fn()} />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('does not render when not visible and not animating', () => {
    const { container } = render(<Toast message="Test" isVisible={false} onClose={jest.fn()} />)

    jest.advanceTimersByTime(300)

    expect(container.firstChild).toBeNull()
  })

  it('calls onClose after duration expires', async () => {
    const mockOnClose = jest.fn()

    render(<Toast message="Test" isVisible={true} onClose={mockOnClose} duration={2000} />)

    expect(mockOnClose).not.toHaveBeenCalled()

    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('uses default duration of 4000ms', async () => {
    const mockOnClose = jest.fn()

    render(<Toast message="Test" isVisible={true} onClose={mockOnClose} />)

    jest.advanceTimersByTime(4000)

    await waitFor(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('closes when backdrop is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const mockOnClose = jest.fn()

    const { container } = render(<Toast message="Test" isVisible={true} onClose={mockOnClose} />)

    const backdrop = container.querySelector('[class*="fixed inset-0"]')
    if (backdrop) {
      await user.click(backdrop)
      jest.advanceTimersByTime(300)
    }

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders success type toast', () => {
    render(<Toast message="Success!" type="success" isVisible={true} onClose={jest.fn()} />)

    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('renders error type toast', () => {
    render(<Toast message="Error!" type="error" isVisible={true} onClose={jest.fn()} />)

    expect(screen.getByText('Error!')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<Toast message="Custom message" isVisible={true} onClose={jest.fn()} />)

    expect(screen.getByText('Custom message')).toBeInTheDocument()
  })

  it('stops propagation when toast content is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const mockOnClose = jest.fn()

    const { container } = render(<Toast message="Test" isVisible={true} onClose={mockOnClose} />)

    const toastContent = container.querySelector('[class*="bg-white"]')
    if (toastContent) {
      await user.click(toastContent)

      expect(mockOnClose).not.toHaveBeenCalled()
    }
  })

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const mockOnClose = jest.fn()

    const { unmount } = render(<Toast message="Test" isVisible={true} onClose={mockOnClose} />)

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
