'use client'

import type { Note } from '@/entities/note'
import Image from 'next/image'

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
    <article className="bg-white max-h-150 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row">
      <div className="md:w-1/2 overflow-hidden">
        <Image
        height={570}
        width={445}
          src={note.img}
          alt={note.title}
          className="w-full h-full object-cover rounded-2xl  min-h-75"
        />
      </div>
      <div className="md:w-1/2 p-6 md:p-9 flex flex-col overflow-y-scroll">
        <h6 className="text-(--color-primary) text-sm font-medium mb-5">{formatDate(note.created_at)}</h6>
        <h4 className="tall text-3xl md:text-4xl mb-4">{note.title}</h4>
        <p className="text-gray-600 leading-relaxed text-base">{note.text}</p>
      </div>
    </article>
  )
}
