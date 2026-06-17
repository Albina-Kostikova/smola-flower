import { Test, TestingModule } from '@nestjs/testing'
import { OrdersService } from './orders.service'
import { SupabaseService } from '../../database/supabase.service'
import { TelegramService } from '../../integrations/telegram/telegram.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { createSupabaseMock } from '@test/mocks/supabase.mock'
import { createQueryMock } from '@test/mocks/query-builder.mock'

describe('OrdersService', () => {
  let service: OrdersService
  let supabaseMock: ReturnType<typeof createSupabaseMock>
  let telegramServiceMock: { sendOrderNotification: jest.Mock }

  const mockCustomer = {
    fio: 'Иван Иванов',
    email: 'ivan@test.com',
    phone: '+79991234567',
    address: 'ул. Тестовая, д. 1',
  }

  const mockCartItems = [
    { id: 'prod-1', title: 'Тестовое украшение', price: 2500, quantity: 2 },
    { id: 'prod-2', title: 'Брошь', price: 1500, quantity: 1 },
  ]

  const mockLessonItem = {
    id: 'lesson-1',
    title: 'Урок по созданию украшений',
    description: 'Мастер-класс',
    price: 5000,
  }

  const mockOrder = {
    id: 'order-1',
    name: 'Иван Иванов',
    email: 'ivan@test.com',
    phone: '+79991234567',
    address: 'ул. Тестовая, д. 1',
    delivery: 'cdek',
    payment: 'card',
    total: 6500,
    status: 'new',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  const mockLessonOrder = {
    id: 'order-1',
    name: 'Иван Иванов',
    email: 'ivan@test.com',
    phone: '+79991234567',
    address: 'не указан',
    delivery: 'lesson',
    payment: 'lesson',
    total: 5000,
    status: 'new',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    supabaseMock = createSupabaseMock()
    telegramServiceMock = {
      sendOrderNotification: jest.fn().mockResolvedValue(undefined),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: SupabaseService,
          useValue: supabaseMock.service,
        },
        {
          provide: TelegramService,
          useValue: telegramServiceMock,
        },
      ],
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  describe('createOrder - корзина', () => {
    const cartDto = {
      customer: mockCustomer,
      delivery: 'cdek',
      payment: 'card',
      items: mockCartItems,
      totalPrice: 6500,
    }

    it('should create order from cart', async () => {
      supabaseMock.client.from
        .mockReturnValueOnce(createQueryMock({ data: mockOrder, error: null }))
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      const result = await service.createOrder(cartDto)

      expect(result).toEqual(mockOrder)
      expect(supabaseMock.client.from).toHaveBeenNthCalledWith(1, 'orders')
      expect(supabaseMock.client.from).toHaveBeenNthCalledWith(2, 'order-items')
    })

    it('should calculate total from items if totalPrice not provided', async () => {
      const { totalPrice, ...dtoWithoutTotal } = cartDto

      const expectedTotal = 2500 * 2 + 1500 * 1

      supabaseMock.client.from
        .mockReturnValueOnce(
          createQueryMock({
            data: { ...mockOrder, total: expectedTotal },
            error: null,
          }),
        )
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      const result = await service.createOrder(dtoWithoutTotal as any)

      expect(result.total).toBe(expectedTotal)
    })

    it('should save order items with prices and titles', async () => {
      supabaseMock.client.from
        .mockReturnValueOnce(createQueryMock({ data: mockOrder, error: null }))
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      await service.createOrder(cartDto)

      // Получаем результат второго вызова from (для order-items)
      const orderItemsMock = supabaseMock.client.from.mock.results[1].value as ReturnType<typeof createQueryMock>
      const orderItems = orderItemsMock.insert.mock.calls[0][0]

      expect(orderItems).toHaveLength(2)
      expect(orderItems[0]).toMatchObject({
        order_id: mockOrder.id,
        product_id: 'prod-1',
        quantity: 2,
        price: 2500,
        title: 'Тестовое украшение',
      })
      expect(orderItems[1]).toMatchObject({
        order_id: mockOrder.id,
        product_id: 'prod-2',
        quantity: 1,
        price: 1500,
        title: 'Брошь',
      })
    })
  })

  describe('createOrder - урок', () => {
    const lessonDto = {
      customer: {
        fio: 'Иван Иванов',
        email: 'ivan@test.com',
        phone: '+79991234567',
      },
      item: mockLessonItem,
    }

    it('should create order from lesson', async () => {
      supabaseMock.client.from
        .mockReturnValueOnce(createQueryMock({ data: mockLessonOrder, error: null }))
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      const result = await service.createOrder(lessonDto)

      expect(result.delivery).toBe('lesson')
      expect(result.payment).toBe('lesson')
      expect(result.total).toBe(5000)
      expect(result.address).toBe('не указан')
    })

    it('should save lesson as single order item', async () => {
      supabaseMock.client.from
        .mockReturnValueOnce(createQueryMock({ data: mockLessonOrder, error: null }))
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      await service.createOrder(lessonDto)

      const orderItemsMock = supabaseMock.client.from.mock.results[1].value as ReturnType<typeof createQueryMock>
      const orderItems = orderItemsMock.insert.mock.calls[0][0]

      expect(orderItems).toHaveLength(1)
      expect(orderItems[0]).toMatchObject({
        order_id: mockLessonOrder.id,
        product_id: 'lesson-1',
        quantity: 1,
        price: 5000,
        title: 'Урок по созданию украшений',
      })
    })

    it('should use default address "не указан" when not provided', async () => {
      const dtoWithoutAddress = {
        customer: {
          fio: 'Иван Иванов',
          email: 'ivan@test.com',
          phone: '+79991234567',
        },
        item: mockLessonItem,
      }

      supabaseMock.client.from
        .mockReturnValueOnce(
          createQueryMock({
            data: { ...mockLessonOrder, address: 'не указан' },
            error: null,
          }),
        )
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      const result = await service.createOrder(dtoWithoutAddress)

      expect(result.address).toBe('не указан')
    })
  })

  describe('createOrder - валидация', () => {
    it('should throw error when no items or item provided', async () => {
      const invalidDto = {
        customer: mockCustomer,
      }

      try {
        await service.createOrder(invalidDto as any)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('Missing items or item data')
        }
      }
    })

    it('should throw error when customer data is missing', async () => {
      const invalidDto = {
        items: mockCartItems,
      }

      try {
        await service.createOrder(invalidDto as any)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })

    it('should throw error when items array is empty', async () => {
      const invalidDto = {
        customer: mockCustomer,
        items: [],
        totalPrice: 0,
      }

      try {
        await service.createOrder(invalidDto as any)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('Missing items or item data')
        }
      }
    })
  })

  describe('createOrder - Telegram уведомление', () => {
    it('should send notification for cart order', async () => {
      supabaseMock.client.from
        .mockReturnValueOnce(createQueryMock({ data: mockOrder, error: null }))
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      await service.createOrder({
        customer: mockCustomer,
        items: mockCartItems,
        totalPrice: 6500,
      })

      expect(telegramServiceMock.sendOrderNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCustomer.fio,
          email: mockCustomer.email,
          total: 6500,
          products: expect.arrayContaining([
            { name: 'Тестовое украшение', quantity: 2 },
            { name: 'Брошь', quantity: 1 },
          ]),
        }),
      )
    })

    it('should send notification for lesson order', async () => {
      supabaseMock.client.from
        .mockReturnValueOnce(createQueryMock({ data: mockLessonOrder, error: null }))
        .mockReturnValueOnce(createQueryMock({ data: null, error: null }))

      await service.createOrder({
        customer: { fio: 'Иван Иванов', email: 'ivan@test.com', phone: '+79991234567' },
        item: mockLessonItem,
      })

      expect(telegramServiceMock.sendOrderNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          delivery: 'Урок',
          payment: 'Оплата урока',
          total: 5000,
          products: [{ name: 'Урок по созданию украшений', quantity: 1 }],
        }),
      )
    })
  })

  describe('getAll', () => {
    it('should return all orders', async () => {
      const mockOrders = [mockOrder, { ...mockOrder, id: 'order-2' }]
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: mockOrders, error: null }))

      const result = await service.getAll()

      expect(result).toEqual(mockOrders)
      expect(result).toHaveLength(2)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('orders')
    })

    it('should return empty array when no orders', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: [], error: null }))

      const result = await service.getAll()

      expect(result).toEqual([])
    })

    it('should throw when fetch fails', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: null, error: new Error('DB error') }))

      await expect(service.getAll()).rejects.toThrow('Failed to fetch orders: DB error')
    })

    it('should order by createdAt descending', async () => {
      const queryMock = createQueryMock({ data: [mockOrder], error: null })
      supabaseMock.client.from.mockReturnValue(queryMock)

      await service.getAll('createdAt')

      expect(queryMock.order).toHaveBeenCalledWith('createdAt', {
        ascending: false,
      })
    })
  })

  describe('getById', () => {
    it('should return an order by id', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: mockOrder, error: null }))

      const result = await service.getById('order-1')

      expect(result).toEqual(mockOrder)
      expect(supabaseMock.client.from).toHaveBeenCalledWith('orders')
    })

    it('should throw NotFoundException when order not found', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: null, error: null }))

      await expect(service.getById('non-existent')).rejects.toThrow(NotFoundException)
      await expect(service.getById('non-existent')).rejects.toThrow('orders with id non-existent not found')
    })

    it('should throw NotFoundException when query errors', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: null, error: new Error('DB error') }))

      await expect(service.getById('bad-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update and return an order', async () => {
      const updatedOrder = { ...mockOrder, status: 'shipped' }
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: updatedOrder, error: null }))

      const result = await service.update('order-1', { status: 'shipped' })

      expect(result).toEqual(updatedOrder)
      expect(result.status).toBe('shipped')
    })

    it('should throw Error when update fails', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: null, error: new Error('Update failed') }))

      await expect(service.update('bad-id', { status: 'shipped' })).rejects.toThrow(
        'Failed to update orders: Update failed',
      )
    })
  })

  describe('delete', () => {
    it('should delete an order successfully', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: null, error: null }))

      await expect(service.delete('order-1')).resolves.not.toThrow()
      expect(supabaseMock.client.from).toHaveBeenCalledWith('orders')
    })

    it('should throw Error when deletion fails', async () => {
      supabaseMock.client.from.mockReturnValue(createQueryMock({ data: null, error: new Error('Delete failed') }))

      await expect(service.delete('bad-id')).rejects.toThrow('Failed to delete orders: Delete failed')
    })
  })
})
