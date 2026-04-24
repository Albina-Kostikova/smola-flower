import { PinkButton } from "@/shared/ui/Buttons"
import { Lesson } from "./types"

export const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="w-135 h-60 bg-(--color-primary) rounded-4xl flex">
      <div>
        <h3 className="font-(--cursive-font)">{lesson.title}</h3>
        <p>{lesson.description}</p>
        <PinkButton text="Купить" />
      </div>
      <div>
        <img src={lesson.img} alt={lesson.title} className="w-full h-auto object-cover" />
        <p className="text-lg font-bold uppercase">{lesson.price} ₽</p>
      </div>
    </div>
  )
}