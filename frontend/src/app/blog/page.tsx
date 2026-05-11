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

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const data = await getAllNotes()
      setNotes(data)
      if (data.length > 0) {
        setCurrentNoteId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const currentNote = notes.find(n => n.id === currentNoteId) || notes[0]

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8 flex items-center justify-center min-h-96">
        <div className="text-(--color-primary) text-xl">Загрузка...</div>
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
