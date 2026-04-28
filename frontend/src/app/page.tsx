import { ItemCard } from '@/entities/item/ItemCard'
import { LessonCard } from '@/entities/lesson'
import { InfoButton, PinkButton } from '@/shared/ui/Buttons'
import Link from 'next/link'

export default function Home() {
  const lessons = [
    { id: 1, title: 'Урок 1', description: 'Описание урока 1', img: '/images/lesson1.jpg', price: 1000 },
    { id: 2, title: 'Урок 2', description: 'Описание урока 2', img: '/images/lesson2.jpg', price: 1500 },
    { id: 3, title: 'Урок 3', description: 'Описание урока 3', img: '/images/lesson3.jpg', price: 2000 },
  ]
  const categories = [
    { title: 'Вазочки', img: './images/vazochki.jpg', src: './catalog#vazochki' },
    { title: 'Серьги', img: './images/sergi.png', src: './catalog#sergi' },
    { title: 'Кулоны', img: './images/kulony.png', src: './catalog#kulony' },
    { title: 'Комплекты', img: './images/komplekty.png', src: './catalog#komplekty' },
    { title: 'Броши', img: './images/broshi.png', src: './catalog#broshi' },
    { title: 'Часы и картины', img: './images/chasyikartiny.png', src: './catalog#chasyikartiny' },
  ]
  return (
    <div>
      <div className="relative bg-[#1B1B27] h-120 w-full flex text-white px-20">
        <div className="flex flex-col w-110 mt-17">
          <h1 className="mb-5 text-[54px] whitespace-nowrap cursive tracking-wide">Уникальные украшения</h1>
          <h4 className="w-full text-2xl tall scale-y-120 scale-x-95 text-end origin-right">и сувениры из смолы</h4>
          <p className="w-95 font-thin text-start text-[15px] mb-12 mt-10 leading-normal tracking-wider">
            Ювелирные украшения, оригинальные сувениры на память и незабываемые подарки в единственном экземпляре!
          </p>
          <PinkButton text="В каталог" />
        </div>
        <img src="./images/main-bg.png" className="absolute right-30 bottom-0 w-155 h-120" alt="plate" />
      </div>

      <div className="py-20 px-10 flex flex-col items-center">
        <h2 className="mb-8">Настоящая красота здесь!</h2>
        <p>Выберите категорию</p>
        <div className="mt-15 grid grid-cols-3 gap-7">
          {categories.map(category => {
            return <ItemCard item={category} />
          })}
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center mb-37">
        <h2>Галерея</h2>

        <p className="mt-8 mb-15 w-95 text-center text-base leading-6">
          Посмотрите парочку видео о том, как получаются готовые изделия и как я упаковываю покупки. Фото популярных
          товаров и новинок, а также отзывы покупателей и свеженькие акции.
        </p>

        <div className="flex items-center justify-center h-161 w-full bg-(--color-secondary) py-8">
          <div className="flex flex-wrap max-w-xl">
            <Link href="/gallery/vazochki" className="inline-block">
              <img src="./images/gallery-video-left.png" alt="Вазочки видео" className="w-135 h-75 mr-8" />
            </Link>
            <Link href="/gallery/komplekty" className="inline-block">
              <img src="./images/komplekty.png" alt="Комплект" className="w-64 h-64 mr-8 mt-8" />
            </Link>
            <Link href="/gallery/broshi" className="inline-block">
              <img src="./images/broshi.png" alt="Брошь" className="w-64 h-64 mt-8 mr-8" />
            </Link>
          </div>
          <div className="flex flex-wrap max-w-xl">
            <Link href="/gallery/sergi" className="inline-block">
              <img src="./images/gallery-right1.png" alt="Серьги" className="w-64 h-64 mr-8" />
            </Link>
            <Link href="/gallery/tarelki" className="inline-block">
              <img src="./images/gallery-right2.png" alt="Тарелки" className="w-64 h-64" />
            </Link>
            <Link href="/gallery/kulon-video" className="inline-block">
              <img src="./images/gallery-video-right.png" alt="Кулон видео" className="w-135 h-75 mt-8" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center px-10">
        <h2>Об украшениях</h2>
        <div className="flex items-center gap-7 mb-3 mt-15 leading-6">
          <ItemCard item={{ title: 'Как это сделано', img: './images/kak-eto-sdelano.png', src: '/about' }} />
          <ItemCard item={{ title: 'Из чего это сделано', img: './images/iz-chego.png', src: '/about' }} />
          <ItemCard item={{ title: 'Правила хранения', img: './images/pravila-hraneniya.png', src: '/about' }} />
        </div>
      </div>

      <div className="flex flex-col justiy-center items-center mt-37">
        <h2>Блог</h2>
        <div className="flex mt-5 h-97 gap-13 justify-center items-start">
          <img src="./images/flower1.svg" alt="flower1" className="w-77 h-90" />
          <div className="flex flex-col w-88 items-start justify-between">
            <p className="text-(--color-secondary) text-sm">23 сентября 2020</p>
            <h4 className="tall scale-x-85 origin-left text-2xl tracking-wider mt-5 mb-4">О работе под заказ</h4>
            <p className="mb-12">
              Необъяснимо, но факт! Когда творишь просто так, не боясь ошибиться с цветом, не переживая за конечный
              результат, всегда получается красиво. Смола непредсказуемый материал и стопроцентный результат не
              гарантирован. В процессе отверждения смола сама меняет рисунок и даже цвет... ‍
            </p>
            <InfoButton text="Продолжить чтение" />
          </div>
          <img src="./images/phone-blog.png" alt="Чехол" className="w-85 h-85" />
        </div>
        <div className="flex mt-20 h-97 gap-13 justify-center items-start">
          <img src="./images/experement-blog.png" alt="Эксперементы" className="w-85 h-85" />
          <div className="flex flex-col w-88 items-start justify-between">
            <p className="text-(--color-secondary) text-sm">25 октября 2020</p>
            <h4 className="tall scale-x-85 origin-left text-2xl tracking-wider mt-5 mb-4">мои эксперименты</h4>
            <p className="mb-5">
              Сегодня новый эксперимент! Делаю поднос для чего угодно, ведь его поверхность будет покрыта термо смолой.
              Это придаст поверхности подноса такую теплостойкость, что можно ставить горячее до 200 градусов, повысит
              износостойкость и покрытие будет сложно поцарапать! Царапины восстанавливаются тут же на глазах...
            </p>
            <InfoButton text="Продолжить чтение" />
          </div>
          <img src="./images/flower2.svg" alt="flower2" className="w-77 h-87" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h2>Обучение</h2>
        <div className="w-full flex bg-(--color-secondary) gap-7 py-15 justify-center">
          <div className="relative rounded-4xl w-87 h-87 flex flex-col items-center bg-white py-11 gap-5">
            <div className="absolute left-2 -top-5 text-[175px] text-(--color-secondary) tall font-thin">1</div>
            <img src="./images/oplata.svg" alt="Оплата" className="w-19 h-18 mb-5" />
            <h6 className="mb-1 tall text-2xl scale-x-90">ОПЛАТА</h6>
            <div className="w-47 flex flex-col text-center text-base leading-5 gap-3">
              <p>Нажмите кнопку “Купить”</p>
              <p>Заполните форму заказа</p>
              <p>Выберите подходящий способ оплаты</p>
            </div>
          </div>
          <div className="relative rounded-4xl w-87 h-87 flex flex-col items-center bg-white py-11 gap-5">
            <div className="absolute left-2 -top-5 text-[175px] text-(--color-secondary) tall font-thin">2</div>
            <img src="./images/avtorizatsiya.svg" alt="Авторизация" className="w-18 h-18 mb-5" />
            <h6 className="mb-1 tall text-2xl scale-x-90">АВТОРИЗАЦИЯ</h6>
            <div className="w-47 flex flex-col text-center text-base leading-5 gap-3">
              <p>Укажите своё имя</p>
              <p>Укажите свой E-mail</p>
              <p>Нажмите кнопку “Отправить”</p>
            </div>
          </div>
          <div className="relative rounded-4xl w-87 h-87 flex flex-col items-center bg-white py-11 gap-5">
            <div className="absolute left-2 -top-5 text-[175px] text-(--color-secondary) tall font-thin">3</div>
            <img src="./images/dostup.svg" alt="Доступ" className="w-19 h-19 mb-5" />
            <h6 className="mb-1 tall text-2xl scale-x-90">ДОСТУП</h6>
            <div className="w-50 flex flex-col text-center text-base leading-5 gap-3">
              <p>Получите ссылку на видео</p>
              <p>Смотрите новое обучающее видео</p>
              <p>Создавайте свои шедевры</p>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  )
}
