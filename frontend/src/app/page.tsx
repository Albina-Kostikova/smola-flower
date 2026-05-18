import { ItemCard } from '@/entities/item/ItemCard'
import { LessonCard } from '@/entities/lesson'
import { InfoButton, PinkButton } from '@/shared/ui/Buttons'
import Link from 'next/link'
import { getAllLessons } from '@/shared/api'
import Image from 'next/image'

export default async function Home() {
  const lessons = await getAllLessons()

  const categories = [
    { title: 'Вазочки', img: '/images/vazochki.jpg', src: '/catalog#vazochki' },
    { title: 'Серьги', img: '/images/sergi.png', src: '/catalog#sergi' },
    { title: 'Кулоны', img: '/images/kulony.png', src: '/catalog#kulony' },
    { title: 'Комплекты', img: '/images/komplekty.png', src: '/catalog#komplekty' },
    { title: 'Броши', img: '/images/broshi.png', src: '/catalog#broshi' },
    { title: 'Часы и картины', img: '/images/chasyikartiny.png', src: '/catalog#suveniry' },
  ]

  return (
    <div>
      <div className="relative bg-[#1B1B27] min-h-100 lg:h-120 w-full flex flex-col lg:flex-row items-center text-white sm:px-8 lg:px-20 pt-8 lg:py-0 overflow-hidden">
        <div className="flex flex-col w-full lg:w-110 mt-0 lg:mt-17 z-10 items-center lg:items-start text-center lg:text-start">
          <h1 className="mb-5 text-3xl sm:text-4xl lg:text-[54px] whitespace-nowrap cursive tracking-wide">
            Уникальные украшения
          </h1>
          <h4 className="w-full text-xl sm:text-2xl tall scale-y-120 scale-x-95 text-center lg:text-right origin-right">
            и сувениры из смолы
          </h4>
          <p className="w-full max-w-sm lg:w-95 font-thin text-sm sm:text-[15px] mb-8 lg:mb-12 mt-6 lg:mt-10 leading-normal tracking-wider">
            Ювелирные украшения, оригинальные сувениры на память и незабываемые подарки в единственном экземпляре!
          </p>
          <Link href="/catalog">
            <PinkButton text="В каталог" />
          </Link>
        </div>
        <Image
          src="/images/main-bg.png"
          className="relative lg:absolute right-0 lg:right-10 xl:right-30 bottom-0 mt-6 lg:mt-0 max-w-full h-auto"
          width={620}
          height={480}
          alt="plate"
          priority
        />
      </div>

      <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10 flex flex-col items-center">
        <h2 className="mb-8">Настоящая красота здесь!</h2>
        <p>Выберите категорию</p>
        <div className="mt-10 lg:mt-15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
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

        <div className="flex flex-col lg:flex-row items-center justify-center h-auto lg:h-161 w-full bg-(--color-secondary) py-6 lg:py-8 overflow-hidden px-4 lg:px-0">
          <div className="flex flex-col w-full lg:max-w-xl gap-3 lg:gap-0">
            <Link href="/gallery" className="inline-block w-full">
              <Image
                src="/images/gallery-video-left.png"
                alt="Вазочки видео"
                width={540}
                height={300}
                className="w-full h-auto lg:h-75 object-cover"
                loading="lazy"
              />
            </Link>
            <div className="flex gap-3 lg:gap-0 lg:mt-8">
              <Link href="/gallery" className="inline-block flex-1">
                <Image
                  src="/images/komplekty.png"
                  alt="Комплект"
                  width={256}
                  height={256}
                  className="w-full h-auto lg:h-64 object-cover"
                  loading="lazy"
                />
              </Link>
              <Link href="/gallery" className="inline-block flex-1 lg:ml-8">
                <Image
                  src="/images/broshi.png"
                  alt="Брошь"
                  width={256}
                  height={256}
                  className="w-full h-auto lg:h-64 object-cover"
                  loading="lazy"
                />
              </Link>
            </div>
          </div>

          {/* Правый блок */}
          <div className="flex flex-col w-full lg:max-w-xl gap-3 lg:gap-0 lg:ml-8 mt-3 lg:mt-0">
            <div className="flex gap-3 lg:gap-0">
              <Link href="/gallery" className="inline-block flex-1">
                <Image
                  src="/images/gallery-right1.png"
                  alt="Серьги"
                  width={256}
                  height={256}
                  className="w-full h-auto lg:h-64 object-cover"
                  loading="lazy"
                />
              </Link>
              <Link href="/gallery" className="inline-block flex-1 lg:ml-8">
                <Image
                  src="/images/gallery-right2.png"
                  alt="Тарелки"
                  width={256}
                  height={256}
                  className="w-full h-auto lg:h-64 object-cover"
                  loading="lazy"
                />
              </Link>
            </div>
            <Link href="/gallery" className="inline-block w-full">
              <Image
                src="/images/gallery-video-right.png"
                alt="Кулон видео"
                width={540}
                height={300}
                className="w-full h-auto lg:h-75 object-cover lg:mt-8"
                loading="lazy"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center px-4 lg:px-10">
        <h2>Об украшениях</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-7 mb-3 mt-15 leading-6">
          <ItemCard item={{ title: 'Как это сделано', img: '/images/kak-eto-sdelano.png', src: '/about' }} />
          <ItemCard item={{ title: 'Из чего это сделано', img: '/images/iz-chego.png', src: '/about' }} />
          <ItemCard item={{ title: 'Правила хранения', img: '/images/pravila-hraneniya.png', src: '/about' }} />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mt-20 lg:mt-37 px-4 lg:px-0">
        <h2>Блог</h2>
        <div className="flex flex-col lg:flex-row mt-5 h-auto lg:h-97 gap-8 lg:gap-13 justify-center items-center lg:items-start">
          <Image src="/images/flower1.svg" alt="flower1" width={308} height={360} className="hidden lg:block" />
          <div className="flex flex-col w-full max-w-md lg:w-88 items-center lg:items-start justify-between text-center lg:text-left">
            <p className="text-(--color-secondary) text-sm">23 сентября 2020</p>
            <h4 className="tall scale-x-85 origin-left text-2xl tracking-wider mt-5 mb-4">О работе под заказ</h4>
            <p className="mb-8 lg:mb-12">
              Необъяснимо, но факт! Когда творишь просто так, не боясь ошибиться с цветом, не переживая за конечный
              результат, всегда получается красиво. Смола непредсказуемый материал и стопроцентный результат не
              гарантирован. В процессе отверждения смола сама меняет рисунок и даже цвет... ‍
            </p>
            <Link href="/blog">
              <InfoButton text="Продолжить чтение" />
            </Link>
          </div>
          <Image
            src="/images/phone-blog.png"
            alt="Чехол"
            width={340}
            height={340}
            className="max-w-62.5 lg:max-w-none"
          />
        </div>
        <div className="flex flex-col lg:flex-row-reverse mt-12 lg:mt-20 h-auto lg:h-97 gap-8 lg:gap-13 justify-center items-center lg:items-start">
          <Image
            src="/images/experement-blog.png"
            alt="Эксперементы"
            width={340}
            height={340}
            className="max-w-62.5 lg:max-w-none"
          />
          <div className="flex flex-col w-full max-w-md lg:w-88 items-center lg:items-start justify-between text-center lg:text-left">
            <p className="text-(--color-secondary) text-sm">25 октября 2020</p>
            <h4 className="tall scale-x-85 origin-left text-2xl tracking-wider mt-5 mb-4">мои эксперименты</h4>
            <p className="mb-5">
              Сегодня новый эксперимент! Делаю поднос для чего угодно, ведь его поверхность будет покрыта термо смолой.
              Это придаст поверхности подноса такую теплостойкость, что можно ставить горячее до 200 градусов, повысит
              износостойкость и покрытие будет сложно поцарапать! Царапины восстанавливаются тут же на глазах...
            </p>
            <Link href="/blog">
              <InfoButton text="Продолжить чтение" />
            </Link>
          </div>
          <Image src="/images/flower2.svg" alt="flower2" width={308} height={360} className="hidden lg:block" />
        </div>
      </div>

      <div className="flex flex-col items-center max-w-full">
        <h2>Обучение</h2>
        <div className="w-full flex flex-col justify-center lg:flex-row bg-(--color-secondary) gap-5 lg:gap-7 py-10 lg:py-15 items-center px-4 lg:px-0">
          <div className="relative rounded-4xl w-full max-w-xs lg:w-87 h-auto lg:h-87 flex flex-col items-center bg-white py-8 lg:py-11 gap-4 lg:gap-5">
            <div className="absolute left-2 -top-5 text-[120px] lg:text-[175px] text-(--color-secondary) tall font-thin">
              1
            </div>
            <Image src="/images/oplata.svg" alt="Оплата" className="mb-3 lg:mb-5" width={76} height={72} />
            <h6 className="mb-1 tall text-xl lg:text-2xl scale-x-90">ОПЛАТА</h6>
            <div className="w-47 flex flex-col text-center text-sm lg:text-base leading-5 gap-2 lg:gap-3">
              <p>Нажмите кнопку &ldquo;Купить&rdquo;</p>
              <p>Заполните форму заказа</p>
              <p>Выберите подходящий способ оплаты</p>
            </div>
          </div>
          <div className="relative rounded-4xl w-full max-w-xs lg:w-87 h-auto lg:h-87 flex flex-col items-center bg-white py-8 lg:py-11 gap-4 lg:gap-5">
            <div className="absolute left-2 -top-5 text-[120px] lg:text-[175px] text-(--color-secondary) tall font-thin">
              2
            </div>
            <Image src="/images/avtorizatsiya.svg" alt="Авторизация" width={72} height={72} />
            <h6 className="mb-1 tall text-xl lg:text-2xl scale-x-90">АВТОРИЗАЦИЯ</h6>
            <div className="w-47 flex flex-col text-center text-sm lg:text-base leading-5 gap-2 lg:gap-3">
              <p>Укажите своё имя</p>
              <p>Укажите свой E-mail</p>
              <p>Нажмите кнопку &ldquo;Отправить&rdquo;</p>
            </div>
          </div>
          <div className="relative rounded-4xl w-full max-w-xs lg:w-87 h-auto lg:h-87 flex flex-col items-center bg-white py-8 lg:py-11 gap-4 lg:gap-5">
            <div className="absolute left-2 -top-5 text-[120px] lg:text-[175px] text-(--color-secondary) tall font-thin">
              3
            </div>
            <Image src="/images/dostup.svg" alt="Доступ" className="mb-3 lg:mb-5" width={76} height={76} />
            <h6 className="mb-1 tall text-xl lg:text-2xl scale-x-90">ДОСТУП</h6>
            <div className="w-50 flex flex-col text-center text-sm lg:text-base leading-5 gap-2 lg:gap-3">
              <p>Получите ссылку на видео</p>
              <p>Смотрите новое обучающее видео</p>
              <p>Создавайте свои шедевры</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-7 mt-10 lg:mt-15 mb-6 lg:mb-8 px-4 lg:px-0">
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
