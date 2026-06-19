import { render, screen } from '@testing-library/react'
import Footer from './Footer'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

describe('Footer', () => {
  it('renders footer with logo', () => {
    render(<Footer />)

    const logo = screen.getByAltText('Smola Flowers')
    expect(logo).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Footer />)

    expect(screen.getByText('Каталог')).toBeInTheDocument()
    expect(screen.getByText('Об украшениях')).toBeInTheDocument()
    expect(screen.getByText('Галерея')).toBeInTheDocument()
    expect(screen.getByText('Доставка и оплата')).toBeInTheDocument()
    expect(screen.getByText('Блог')).toBeInTheDocument()
    expect(screen.getByText('Обучение')).toBeInTheDocument()
  })

  it('renders social links with correct href values', () => {
    render(<Footer />)

    const instagramLink = screen.getByText('@smola_flower').closest('a')
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/smola_flower')

    const phoneLink = screen.getByText('+7 (937) 596-27-26').closest('a')
    expect(phoneLink).toHaveAttribute('href', 'tel:+79375962726')

    const emailLink = screen.getByText('smola_flower@gmail.com').closest('a')
    expect(emailLink).toHaveAttribute('href', 'mailto:smola_flower@gmail.com')
  })

  it('renders social media icons', () => {
    render(<Footer />)

    expect(screen.getByAltText('instagram')).toBeInTheDocument()
    expect(screen.getByAltText('phone')).toBeInTheDocument()
    expect(screen.getByAltText('email')).toBeInTheDocument()
  })

  it('renders copyright text', () => {
    render(<Footer />)

    expect(screen.getByText('© 2026 все права защищены')).toBeInTheDocument()
  })

  it('renders home link in footer', () => {
    render(<Footer />)

    const homeLink = screen.getByAltText('Smola Flowers').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders navigation links with correct hrefs', () => {
    render(<Footer />)

    const catalogLink = screen.getByText('Каталог').closest('a')
    expect(catalogLink).toHaveAttribute('href', '/catalog')

    const aboutLink = screen.getByText('Об украшениях').closest('a')
    expect(aboutLink).toHaveAttribute('href', '/about')

    const galleryLink = screen.getByText('Галерея').closest('a')
    expect(galleryLink).toHaveAttribute('href', '/gallery')

    const lessonsLink = screen.getByText('Обучение').closest('a')
    expect(lessonsLink).toHaveAttribute('href', '/lessons')
  })
})
