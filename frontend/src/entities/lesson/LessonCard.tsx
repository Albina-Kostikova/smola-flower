'use client'
import { PinkButton } from '@/shared/ui/Buttons'
import { Lesson } from './types'
import { useRouter } from 'next/navigation';

export const LessonCard = ({ lesson, className = '' }: { lesson: Lesson; className?: string }) => {
  const router = useRouter()
  return (
    <div className={`w-135 h-60 p-10 rounded-4xl flex justify-between text-white ${className}`}>
      <div className="flex flex-col justify-between">
        <h3 className="cursive text-5xl">{lesson.title}</h3>
        <p className="text-sm">{lesson.description}</p>
        <PinkButton text="Купить" onClick={() => router.push(`/lessons/${lesson.id}`)}/>
      </div>
      <div className="flex flex-col items-end justify-between">
        <img src={lesson.img} alt={lesson.title} className="w-full h-auto object-cover" />
        <p className="tall font-light text-3xl">{lesson.price} <span className="text-2xl font-light">₽</span></p>
      </div>
    </div>
  )
}
