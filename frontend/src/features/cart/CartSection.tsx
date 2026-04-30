'use client'

import { useState } from 'react'
import { useCartStore } from './cart.store'
import { PinkButton } from '@/shared/ui/Buttons'
import Image from 'next/image'

type CartSectionProps = {
  isOpen: boolean
  onClose: () => void
}

export const CartSection = ({ isOpen, onClose }: CartSectionProps) => {
  const { items, totalPrice, removeFromCart, clearCart } = useCartStore()
  const [delivery, setDelivery] = useState('courier')
  const [payment, setPayment] = useState('card')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fio: '',
    email: '',
    phone: '',
    address: '',
  })

  if (!isOpen) return null

  const deliveryOptions = [
    { value: 'Самовывоз по Бугульме', label: 'Самовывоз по Бугульме' },
    { value: 'Оzon, WB, Yandex', label: 'Оzon, WB, Yandex' },
    { value: 'Почта России', label: 'Почта России' },
  ]

  const paymentOptions = [
    { value: 'Перевод (СБП)', label: 'Перевод (СБП)' },
    { value: 'Наличный расчет', label: 'Наличный расчет' },
    { value: 'Другое', label: 'Другое' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSendOrder = async () => {
    if (!formData.fio || !formData.email || !formData.phone || !formData.address) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    if (items.length === 0) {
      setError('Корзина пуста')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const orderData = {
        customer: {
          fio: formData.fio,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        delivery,
        payment,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
      }

      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Ошибка при отправке заказа')
      }

      const result = await response.json()
      console.log('Заказ успешно отправлен:', result)

      clearCart()
      setFormData({ fio: '', email: '', phone: '', address: '' })
      alert('Заказ успешно оформлен! Скоро с вами свяжется администратор.')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      console.error('Ошибка при отправке заказа:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-h-12/12 overflow-y-auto max-w-6xl rounded-4xl bg-white px-6 py-7">
        <div className="relative w-full flex items-center justify-center border-b border-gray-300 mb-8 pb-3">
          <h2>Корзина</h2>
          <button onClick={onClose} className="absolute right-4 h-8 w-8 cursor-pointer hover:opacity-70">
            <Image src="/images/cart-close.svg" alt="Закрыть" width={32} height={32} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h3 className="tall tracking-wide mb-4 scale-y-110">Доставка</h3>
              <div className="space-y-3">
                {deliveryOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value={option.value}
                      checked={delivery === option.value}
                      onChange={e => setDelivery(e.target.value)}
                      className="w-4 h-4 accent-(--color-primary)"
                    />
                    <span className="ml-3">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="tall tracking-wide mb-4 scale-y-110">Способ оплаты</h3>
              <div className="space-y-3">
                {paymentOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={payment === option.value}
                      onChange={e => setPayment(e.target.value)}
                      className="w-4 h-4 accent-(--color-primary)"
                    />
                    <span className="ml-3">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="tall tracking-wider scale-y-110">Контактные данные</h3>
              <input
                type="text"
                name="fio"
                placeholder="ФИО"
                value={formData.fio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 outline-none focus:border-(--color-primary) focus:text-(--color-primary) rounded-lg"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 outline-none focus:border-(--color-primary) focus:text-(--color-primary) rounded-lg"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Номер телефона"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 outline-none focus:border-(--color-primary) focus:text-(--color-primary) rounded-lg"
              />

              <input
                type="text"
                name="address"
                placeholder="Адрес доставки"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 outline-none focus:border-(--color-primary) focus:text-(--color-primary) rounded-lg"
              />
            </div>
          </div>

          <div>
            <h3 className="tall tracking-wide mb-2 scale-y-110">Выбранные товары</h3>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500">Корзина пуста</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="border-t border-gray-300 pt-4 flex items-center justify-between">
                    <Image
                      src={item.img}
                      alt={item.title}
                      className="rounded-2xl object-cover"
                      width={80}
                      height={80}
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600">
                        {item.price} ₽ x {item.quantity}
                      </p>
                      <p className="font-semibold">{item.price * item.quantity} ₽</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} title="Удалить" className="ml-4 hover:opacity-70">
                      <Image alt="Удалить" src="/images/cart-close.svg" width={24} height={24} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <>
                <div className="border-t border-gray-300 py-4">
                  <div className="flex justify-between mb-2">
                    <span>Сумма товаров:</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                  <div className="border-t border-gray-300 flex justify-between py-2">
                    <span>Доставка:</span>
                    <span>{delivery === 'Самовывоз по Бугульме' ? 'бесплатно' : '200 ₽'}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg">
                    <span>Итого:</span>
                    <span>{delivery !== 'Самовывоз по Бугульме' ? totalPrice + 200 : totalPrice} ₽</span>
                  </div>
                </div>
                <div className="flex flex-col justiffy-center items-center">
                  <PinkButton onClick={handleSendOrder} text="Оформить заказ" className="mt-6" />
                  <p className="text-xs max-w-100 text-gray-600 mt-4 text-center">
                    Нажимая на кнопку, вы подтверждаете, что ознакомились с{' '}
                    <a href="#" className="text-(--color-primary) underline">
                      политикой конфиденциальности
                    </a>{' '}
                    и даете согласие на{' '}
                    <a href="#" className="text-(--color-primary) underline">
                      обработку своих персональных данных
                    </a>
                    .
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
