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
    <article className="bg-white max-h-none lg:max-h-150 rounded-2xl overflow-hidden shadow-lg flex flex-col lg:flex-row">
      <div className="lg:w-[40%] overflow-hidden shrink-0">
        <Image
          height={570}
          width={445}
          src={note.img}
          alt={note.title}
          className="w-full h-full object-cover rounded-2xl min-h-60 lg:min-h-full"
        />
      </div>
      <div className="lg:w-[62%] px-5 sm:px-6 pb-4 sm:pb-6 pt-2 flex flex-col justify-start overflow-y-scroll">
        <h6 className="text-(--color-primary) text-sm font-medium mb-3 sm:mb-5">{formatDate(note.created_at)}</h6>
        <h4 className="tall text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">{note.title}</h4>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{note.text}</p>
      </div>
    </article>
  )
}
