'use client'
import { LessonCard } from '@/entities/lesson'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { getAllLessons } from '@/shared/api'

export default async function LessonsPage() {
  const lessons = await getAllLessons()
  
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <div className="grid grid-cols-2 gap-7 mt-15 mb-8">
        {lessons.map((lesson, index) => {
          const col = index % 2
          const row = Math.floor(index / 2)
          const isDark = (row + col) % 2 === 1
          return (
            <LessonCard key={lesson.id} lesson={lesson} className={isDark ? 'bg-gray-800' : 'bg-(--color-primary)'} />
          )
        })}
      </div>
    </section>
  )
}
