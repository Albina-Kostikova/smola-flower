import { PinkButton } from '@/shared/ui/Buttons'
import { Lesson } from './types'

export const LessonCard = ({ lesson, className = '' }: { lesson: Lesson; className?: string }) => {
  return (
    <div className={`w-135 h-60 p-10 rounded-4xl flex justify-between ${className}`}>
      <div className="flex flex-col justify-between">
        <h3 className="font-(--cursive-font)">{lesson.title}</h3>
        <p>{lesson.description}</p>
        <PinkButton text="Купить" />
      </div>
      <div className="flex flex-col items-end justify-between">
        <img src={lesson.img} alt={lesson.title} className="w-full h-auto object-cover" />
        <p className="text-lg font-bold uppercase">{lesson.price} ₽</p>
      </div>
    </div>
  )
}
