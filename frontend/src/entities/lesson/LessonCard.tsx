'use client'
import { PinkButton } from '@/shared/ui/Buttons'
import { Lesson } from './types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export const LessonCard = ({ lesson, className = '' }: { lesson: Lesson; className?: string }) => {
  const router = useRouter()
  return (
    <div
      className={`w-full lg:w-135 h-auto lg:h-60 p-4 sm:p-6 lg:p-10 rounded-4xl flex justify-between text-white ${className}`}>
      <div className="flex flex-col justify-between min-w-0">
        <h3 className="cursive text-2xl sm:text-3xl lg:text-5xl">{lesson.title}</h3>
        <p className="text-xs sm:text-sm my-3 lg:my-5 max-w-full lg:max-w-65">{lesson.description}</p>
        <PinkButton text="Купить" onClick={() => router.push(`/lessons/${lesson.id}`)} />
      </div>
      <div className="flex flex-col items-end justify-between ml-2 lg:ml-0 shrink-0">
        <Image
          src={lesson.img}
          alt={lesson.title}
          className="object-fit w-24 sm:w-28 lg:w-45 h-auto"
          width={180}
          height={100}
        />
        <p className="tall font-light text-xl sm:text-2xl lg:text-3xl">
          {lesson.price} <span className="text-lg lg:text-2xl font-light">₽</span>
        </p>
      </div>
    </div>
  )
}
