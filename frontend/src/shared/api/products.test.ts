import { getAllProducts, getProductById, searchProducts } from './products'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Products API', () => {
  const mockProducts = [
    { id: '1', title: 'Украшение 1', price: 1000, category: 'vazochki', img: '/img1.jpg', stock: true },
    { id: '2', title: 'Украшение 2', price: 2000, category: 'sergi', img: '/img2.jpg', stock: false },
  ]

  describe('getAllProducts', () => {
    it('fetches all products successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })

      const result = await getAllProducts()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products'),
        expect.objectContaining({ next: { revalidate: 3600 } }),
      )
      expect(result).toEqual(mockProducts)
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      })

      await expect(getAllProducts()).rejects.toThrow('Failed to fetch products: Internal Server Error')
    })

    it('throws error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getAllProducts()).rejects.toThrow('Network error')
    })
  })

  describe('getProductById', () => {
    it('fetches product by id successfully', async () => {
      const product = mockProducts[0]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => product,
      })

      const result = await getProductById('1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products/1'),
        expect.objectContaining({ cache: 'no-store' }),
      )
      expect(result).toEqual(product)
    })

    it('throws 404 error when product not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(getProductById('999')).rejects.toThrow('Product with id 999 not found')
    })

    it('throws generic error on other failures', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      })

      await expect(getProductById('1')).rejects.toThrow('Failed to fetch product: Server Error')
    })
  })

  describe('searchProducts', () => {
    it('searches with all filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProducts[0]],
      })

      const result = await searchProducts({
        color: 'gold',
        form: 'round',
        material: 'epoxy',
        minPrice: 500,
        maxPrice: 1500,
      })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/products/search?'), expect.any(Object))

      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('color=gold')
      expect(url).toContain('form=round')
      expect(url).toContain('material=epoxy')
      expect(url).toContain('minPrice=500')
      expect(url).toContain('maxPrice=1500')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockProducts[0])
    })

    it('searches with partial filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const result = await searchProducts({ color: 'silver' })

      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('color=silver')
      expect(url).not.toContain('form=')
      expect(url).not.toContain('material=')

      expect(result).toEqual([])
    })

    it('throws error on search failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      })

      await expect(searchProducts({ color: 'invalid' })).rejects.toThrow('Failed to search products: Bad Request')
    })

    it('handles empty filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })

      const result = await searchProducts({})

      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('/api/products/search?')

      expect(result).toEqual(mockProducts)
    })
  })
})
