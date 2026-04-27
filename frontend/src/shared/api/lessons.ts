import type { Lesson } from '@/entities/lessons'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getAllLessons(): Promise<Lesson[]> {
  const res = await fetch(`${API_URL}/api/lessons`)

  if (!res.ok) {
    throw new Error(`Failed to fetch lessons: ${res.statusText}`)
  }

  return res.json()
}

/**
 * Получить урок по ID
 */
export async function getLessonById(id: string): Promise<Lesson> {
  const res = await fetch(`${API_URL}/api/lessons/${id}`, {
    next: { revalidate: 300 }, // Кэш на 5 минут
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Lesson with id ${id} not found`)
    }
    throw new Error(`Failed to fetch lesson: ${res.statusText}`)
  }

  return res.json()
}

/**
 * Получить уроки по категории
 */
export async function getLessonsByCategory(category: string): Promise<Lesson[]> {
  const res = await fetch(`${API_URL}/api/lessons/category/${category}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch lessons by category: ${res.statusText}`)
  }

  return res.json()
}

/**
 * Получить уроки по уровню сложности
 */
export async function getLessonsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<Lesson[]> {
  const res = await fetch(`${API_URL}/api/lessons/difficulty/${difficulty}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch lessons by difficulty: ${res.statusText}`)
  }

  return res.json()
}
