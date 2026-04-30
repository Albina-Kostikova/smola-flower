'use client'

import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { PinkButton } from '@/shared/ui/Buttons'
import { useState, useEffect } from 'react'
import { getLessonById } from '@/shared/api'
import type { Lesson } from '@/entities/lesson'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001'

export default function LessonPage({ params }: { params: { id: string }}) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fio: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLessonById(params.id)
        setLesson(data)
      } catch (err) {
        console.error('Error fetching lesson:', err)
        setError('Урок не найден')
      }
    }
    fetchLesson()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSendLessonOrder = async () => {
    if (!lesson) return

    if (!formData.fio || !formData.email || !formData.phone) {
      setError('Пожалуйста, заполните все поля')
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
        },
        item: {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          price: lesson.price,
        },
      }

      const response = await fetch(`${API_URL}/api/orders`, {
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

      setFormData({ fio: '', email: '', phone: '' })
      alert('Заказ успешно оформлен! Скоро с вами свяжется администратор.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      console.error('Ошибка при отправке заказа:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!lesson) {
    return (
      <div className="flex flex-col mx-auto max-w-6xl mb-25 mt-10">
        <Breadcrumbs />
        <div className="flex flex-col justify-center items-center h-64">
          <Image src="/images/spiner.svg" alt="Loading..." width={200} height={200}/>
          <p>{ error || 'Загрузка...'}</p>
        </div>
      </div>
    )
  }
    const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Обучение', href: '/lessons' },
    { label: lesson.title, href: `/lessons/${lesson.id}` },
  ]

  return (
    <div className="flex flex-col mx-auto max-w-6xl mb-25 mt-10">
    <Breadcrumbs items={breadcrumbs}/>
    <div className="flex flex-col items-center justify-center">
      <h2 className="tall text-xl font-light mb-10">Учебное видео "{lesson.title}"</h2>
      <div className="flex">
        <Image src={lesson.img} alt="Картинка урока" className="object-cover rounded-4xl mr-8" width={350} height={280}/>
        <div className="flex flex-col gap-5">
          <input 
          className="rounded-2xl h-15 p-4 text-lg border border-black focus:border-(--color-secondary) text-gray-700 outline-none focus:text-(--color-primary)"
          type="text" 
          placeholder="Имя" 
          name="fio"
          value={formData.fio} 
          onChange={handleInputChange} 
          />
          <input 
          className="rounded-2xl h-15 p-4 text-lg border border-black focus:border-(--color-secondary) text-gray-700 outline-none focus:text-(--color-primary)"
          type="email" 
          placeholder="Электронная почта" 
          name="email"
          value={formData.email} 
          onChange={handleInputChange} 
          />
          <input 
          className="rounded-2xl h-15 p-4 text-lg border border-black focus:border-(--color-secondary) text-gray-700 outline-none focus:text-(--color-primary)"
          type="tel" 
          placeholder="Номер телефона" 
          name="phone"
          value={formData.phone} 
          onChange={handleInputChange} 
          />
          <div className="flex gap-2.5 mt-12">
            <Image src="/images/chain.svg" alt="" width={50} height={50}/>
            <p>
              После отправки заявки администратор свяжется с Вами для оплаты, затем на указанную Вами почту придет ссылка на
              видео.
            </p>
          </div>
        </div>
        
      </div>
      <div className="flex flex-col items-center justify-center mt-12">
          <PinkButton
            onClick={handleSendLessonOrder}
            text={lesson.title === 'Заливка' ? 'Получить в подарок' : 'Отправить заявку'}
          />
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
    </div>
    </div>
  )
}
