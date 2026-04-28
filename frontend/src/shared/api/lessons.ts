import type { Lesson } from '@/entities/lesson'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getAllLessons(): Promise<Lesson[]> {
  const res = await fetch(`${API_URL}/api/lessons`)
  if (!res.ok) {
    throw new Error(`Failed to fetch lessons: ${res.statusText}`)
  }
  return res.json()
}

export async function getLessonById(id: string): Promise<Lesson> {
  const res = await fetch(`${API_URL}/api/lessons/${id}`, {
  })
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Lesson with id ${id} not found`)
    }
    throw new Error(`Failed to fetch lesson: ${res.statusText}`)
  }
  return res.json()
}