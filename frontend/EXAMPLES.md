/**
 * ПРИМЕР 1: Использование в серверном компоненте (Next.js 13+)
 * Это лучше всего для статических данных
 */

import { getAllProducts, getProductById } from "@/shared/api/products"
import { getAllLessons } from "@/shared/api/lessons"

export default async function CatalogPage() {
  // На сервере можно просто вызывать функции - они автоматически кэшируются
  const products = await getAllProducts()
  const lessons = await getAllLessons()

  return (
    <div>
      <h1>Каталог продуктов ({products.length})</h1>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border">
            <h2>{product.title}</h2>
            <p>Цена: {product.price} ₽</p>
            <p>Материал: {product.material}</p>
          </div>
        ))}
      </div>

      <h1>Уроки ({lessons.length})</h1>
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="p-4 border">
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
            <p>Уровень: {lesson.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * ПРИМЕР 2: Использование в клиентском компоненте с хуками
 * Для интерактивных компонентов с фильтрами и поиском
 */

"use client"

import { useAllProducts, useSearchProducts } from "@/shared/hooks/useProducts"
import { useState } from "react"

export function ProductFilter() {
  const [color, setColor] = useState<string>()
  const { products, loading, error } = useSearchProducts({ color })

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error.message}</div>

  return (
    <div>
      <input
        placeholder="Фильтр по цвету"
        value={color || ""}
        onChange={(e) => setColor(e.target.value || undefined)}
      />
      <div className="grid gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

/**
 * ПРИМЕР 3: Использование для конкретного продукта/урока
 */

"use client"

import { useProduct } from "@/shared/hooks/useProducts"
import { useLesson } from "@/shared/hooks/useLessons"

export function ProductDetailPage({ productId }: { productId: string }) {
  const { product, loading, error } = useProduct(productId)

  if (loading) return <div>Загрузка продукта...</div>
  if (error) return <div>Ошибка: {error.message}</div>
  if (!product) return <div>Продукт не найден</div>

  return (
    <div>
      <img src={product.img} alt={product.title} />
      <h1>{product.title}</h1>
      <p>Цена: {product.price} ₽</p>
      <p>Техника: {product.technic}</p>
      <p>Материал: {product.material}</p>
      <p>Форма: {product.form}</p>
      <p>Цвет: {product.color}</p>
      <p>Диаметр: {product.diameter}</p>
    </div>
  )
}

export function LessonDetailPage({ lessonId }: { lessonId: string }) {
  const { lesson, loading, error } = useLesson(lessonId)

  if (loading) return <div>Загрузка урока...</div>
  if (error) return <div>Ошибка: {error.message}</div>
  if (!lesson) return <div>Урок не найден</div>

  return (
    <div>
      {lesson.image && <img src={lesson.image} alt={lesson.title} />}
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      <p>Автор: {lesson.author}</p>
      <p>Уровень: {lesson.difficulty}</p>
      <p>Длительность: {lesson.duration} минут</p>
      <div>{lesson.content}</div>
      {lesson.videoUrl && (
        <iframe width="100%" height="400" src={lesson.videoUrl} title={lesson.title} />
      )}
    </div>
  )
}
