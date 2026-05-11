'use client'

import { InfoButton } from '@/shared/ui/Buttons'
import type { Note } from '@/entities/note'
import Image from 'next/image'
interface NotesListProps {
  notes: Note[]
  currentNoteId: string | null
  onNoteSelect: (id: string) => void
}

const formatDate = (dateStr: Date | string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function NotesList({ notes, currentNoteId, onNoteSelect }: NotesListProps) {
  const otherNotes = notes.filter(n => n.id !== currentNoteId)

  if (otherNotes.length === 0) {
    return (
      <aside className="bg-white rounded-2xl shadow-lg p-6 h-fit">
        <h2 className="cursive text-2xl mb-6 text-(--color-primary)">Другие статьи</h2>
        <p className="text-gray-400 text-center py-4">Нет других статей</p>
      </aside>
    )
  }

  return (
    <aside className="bg-white rounded-2xl shadow-lg h-fit">
      <h2 className="cursive text-2xl mb-5 text-(--color-primary)">Другие статьи</h2>
      <div className="space-y-6">
        {otherNotes.map(note => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note.id)}
            className="flex gap-4 w-111 rounded-xl hover:bg-(--color-accent) transition-colors cursor-pointer"
          >
            <Image
              width={160}
              height={285}
              src={note.img}
              alt={note.title}
              className="rounded-lg object-cover shrink-0"
              loading="lazy"
            />
            <div className="min-w-0 flex flex-col justify-between">
              <h6 className="text-(--color-primary) text-xs mb-1">{formatDate(note.created_at)}</h6>
              <h4 className="tall text-sm    mb-1 leading-tight">{note.title}</h4>
              <p className="text-gray-500 text-xs line-clamp-5">{note.text}</p>
              <InfoButton className="text-sm mt-3" text="Продолжить чтение" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}