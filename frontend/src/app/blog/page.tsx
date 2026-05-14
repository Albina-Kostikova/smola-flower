'use client'

import { useState, useEffect } from 'react'
import type { Note } from '@/entities/note'
import { getAllNotes } from '@/shared/api'
import { ArticleCard } from '@/features/article'
import { NotesList } from '@/features/notes'
import { CommentsSection } from '@/features/comments'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'

export default function BlogPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const controller = new AbortController()

    loadNotes()

    async function loadNotes() {
      try {
        const timeout = setTimeout(() => setLoading(false), 1000)

        const data = await getAllNotes()
        clearTimeout(timeout)

        if (!cancelled) {
          setNotes(data)
          if (data.length > 0) {
            setCurrentNoteId(data[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err)
        if (!cancelled) {
          setLoadError('Не удалось загрузить статьи')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  const currentNote = notes.find(n => n.id === currentNoteId) || notes[0]

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8 space-y-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48" />

        <div className="space-y-4">
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8 space-y-8">
        <Breadcrumbs />
        <div className="text-center py-20">
          <p className="text-(--color-primary) text-xl mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90">
            Попробовать снова
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 space-y-8">
      <Breadcrumbs />
      <ArticleCard note={currentNote} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <NotesList notes={notes} currentNoteId={currentNoteId} onNoteSelect={setCurrentNoteId} />
        <CommentsSection noteId={currentNoteId} />
      </div>
    </section>
  )
}
