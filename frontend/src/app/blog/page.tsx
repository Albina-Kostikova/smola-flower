import { InfoButton } from "@/shared/ui/Buttons";

export default function BlogPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div>
        <img src={note.img} alt="Картинка" className="w-111 h-142 cover" />
        <div className="flex flex-col items-center justify-between">
          <h6 className="text-(--color-primary) text-sm">{note.date}</h6>
          <h4 className="tall">{note.title}</h4>
          <p>{note.text}</p>
        </div>
      </div>
      <div>
        <div>
          {notes.map(note => (
            <div>
              <img alt="Картинка" className="w-40 h-72" />
              <div>
                <h6>{note.date}</h6>
                <h4>{note.title}</h4>
                <p>{note.text}</p>
                <InfoButton text="Продолжить чтение" />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    </section>
  )
}
