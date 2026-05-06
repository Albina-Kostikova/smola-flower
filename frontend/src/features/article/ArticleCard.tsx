'use client'

import type { Note } from '@/entities/note'

interface ArticleCardProps {
  note: Note | null
}

const formatDate = (dateStr: Date | string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ArticleCard({ note }: ArticleCardProps) {
  if (!note) {
    return (
      <article className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-center p-10">
        <p className="text-gray-400 text-lg">Статья не найдена</p>
      </article>
    )
  }

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row">
      <div className="md:w-1/2 overflow-hidden">
        <img
          src={note.img}
          alt={note.title}
          className="w-full h-full object-cover min-h-75 transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
        <h6 className="text-(--color-primary) text-sm font-medium mb-2">{formatDate(note.created_at)}</h6>
        <h4 className="tall text-3xl md:text-4xl mb-4">{note.title}</h4>
        <p className="text-gray-600 leading-relaxed text-lg">{note.text}</p>
      </div>
    </article>
  )
}
