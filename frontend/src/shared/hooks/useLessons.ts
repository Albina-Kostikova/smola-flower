'use client'

import { useState, useEffect } from 'react'
import type { Lesson } from '@/entities/lesson'
import { getAllLessons, getLessonById, getLessonsByCategory, getLessonsByDifficulty } from '@/shared/api/lessons'

export function useAllLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true)
        const data = await getAllLessons()
        setLessons(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  return { lessons, loading, error }
}

export function useLesson(id: string) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchLesson = async () => {
      try {
        setLoading(true)
        const data = await getLessonById(id)
        setLesson(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id])

  return { lesson, loading, error }
}

export function useLessonsByCategory(category: string) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!category) return

    const fetchLessons = async () => {
      try {
        setLoading(true)
        const data = await getLessonsByCategory(category)
        setLessons(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [category])

  return { lessons, loading, error }
}

export function useLessonsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced') {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true)
        const data = await getLessonsByDifficulty(difficulty)
        setLessons(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [difficulty])

  return { lessons, loading, error }
}
