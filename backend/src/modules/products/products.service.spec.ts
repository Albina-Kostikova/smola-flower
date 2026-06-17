import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './products.service'
import { SupabaseService } from '../../database/supabase.service'
import { createQueryMock } from '@test/mocks/query-builder.mock'
import { createSupabaseMock } from '@test/mocks/supabase.mock'
import { mockProduct, mockProducts } from '@test/fixtures/product.fixture'

describe('ProductService', () => {
  let service: ProductService
  let supabaseMock: ReturnType<typeof createSupabaseMock>

  beforeEach(async () => {
    supabaseMock = createSupabaseMock()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: SupabaseService,
          useValue: supabaseMock.service,
        },
      ],
    }).compile()

    service = module.get<ProductService>(ProductService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockProducts, error: null }),
      )

      const result = await service.getAll()

      expect(result).toEqual(mockProducts)
      expect(result).toHaveLength(3)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('products')
    })

    it('should return empty array when no products', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: [], error: null }),
      )

      const result = await service.getAll()

      expect(result).toEqual([])
    })

    it('should throw when Supabase fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('DB error') }),
      )

      await expect(service.getAll()).rejects.toThrow('Failed to fetch products: DB error')
    })
  })

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockProduct, error: null }),
      )

      const result = await service.getById(mockProduct.id)

      expect(result).toEqual(mockProduct)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('products')
    })

    it('should throw NotFoundException when product not found', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: null }),
      )

      await expect(service.getById('non-existent')).rejects.toThrow(
        `products with id non-existent not found`,
      )
    })
  })

  describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      const categoryProducts = mockProducts.filter(p => p.category === 'колье')
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: categoryProducts, error: null }),
      )

      const result = await service.getProductsByCategory('колье')

      expect(result).toEqual(categoryProducts)
    })

    it('should exclude product by id', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: [mockProducts[1], mockProducts[2]], error: null }),
      )

      const result = await service.getProductsByCategory('кольца', mockProducts[0].id)

      expect(result).toHaveLength(2)
    })

    it('should limit results', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: mockProducts.slice(0, 2), error: null }),
      )

      const result = await service.getProductsByCategory('колье', undefined, 2)

      expect(result).toHaveLength(2)
    })
  })

  describe('create', () => {
    it('should create and return a product', async () => {
      const newProduct = { ...mockProduct, id: 'new-id' }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: newProduct, error: null }),
      )

      const result = await service.create(newProduct)

      expect(result).toEqual(newProduct)
      expect(result.id).toBe('new-id')
    })

    it('should throw when creation fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Insert failed') }),
      )

      await expect(service.create(mockProduct)).rejects.toThrow(
        'Failed to create products: Insert failed',
      )
    })
  })

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const updatedProduct = { ...mockProduct, price: 3000 }
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: updatedProduct, error: null }),
      )

      const result = await service.update(mockProduct.id, { price: 3000 })

      expect(result).toEqual(updatedProduct)
      expect(result.price).toBe(3000)
    })

    it('should throw when update fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Update failed') }),
      )

      await expect(service.update('bad-id', {})).rejects.toThrow(
        'Failed to update products: Update failed',
      )
    })
  })

  describe('delete', () => {
    it('should delete a product', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: null }),
      )

      await expect(service.delete(mockProduct.id)).resolves.not.toThrow()
    })

    it('should throw when deletion fails', async () => {
      supabaseMock.client.from.mockReturnValue(
        createQueryMock({ data: null, error: new Error('Delete failed') }),
      )

      await expect(service.delete('bad-id')).rejects.toThrow(
        'Failed to delete products: Delete failed',
      )
    })
  })
})