import { useBreadcrumbs } from './useBreadcrumbs'
import { usePathname } from 'next/navigation'

jest.mock('next/navigation')

const mockedUsePathname = usePathname as jest.Mock

describe('useBreadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns root breadcrumb for home page', () => {
    mockedUsePathname.mockReturnValue('/')

    const breadcrumbs = useBreadcrumbs()

    expect(breadcrumbs).toEqual([{ label: 'Главная', href: '/' }])
  })

  it('generates breadcrumbs for single segment path', () => {
    mockedUsePathname.mockReturnValue('/catalog')

    const breadcrumbs = useBreadcrumbs()

    expect(breadcrumbs).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Каталог', href: '/catalog' },
    ])
  })

  it('generates breadcrumbs for multiple segment path', () => {
    mockedUsePathname.mockReturnValue('/catalog/product-id')

    const breadcrumbs = useBreadcrumbs()

    expect(breadcrumbs).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Каталог', href: '/catalog' },
      { label: 'Product Id', href: '/catalog/product-id' },
    ])
  })

  it('translates known paths using dictionary', () => {
    mockedUsePathname.mockReturnValue('/about')

    const breadcrumbs = useBreadcrumbs()

    expect(breadcrumbs).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Об украшениях', href: '/about' },
    ])
  })

  it('translates nested known paths', () => {
    mockedUsePathname.mockReturnValue('/lessons/1')

    const breadcrumbs = useBreadcrumbs()

    expect(breadcrumbs).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Обучение', href: '/lessons' },
      { label: '1', href: '/lessons/1' },
    ])
  })

  it('handles URL-encoded segments', () => {
    mockedUsePathname.mockReturnValue('/blog/hello%20world')

    const breadcrumbs = useBreadcrumbs()

    expect(breadcrumbs).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Блог', href: '/blog' },
      { label: 'Hello World', href: '/blog/hello%20world' },
    ])
  })

  it('converts hyphenated segments to title case', () => {
    mockedUsePathname.mockReturnValue('/some-product-name')

    const breadcrumbs = useBreadcrumbs()

    expect(breadcrumbs).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Some Product Name', href: '/some-product-name' },
    ])
  })
})
