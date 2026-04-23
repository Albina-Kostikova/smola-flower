import { LessonCard } from '@/entities/lessons'
import { ProductCard } from '@/entities/product'
import { PinkButton } from '@/shared/ui/Buttons'

export default function Home() {
  const lessons = [
    { id: 1, title: 'Урок 1', description: 'Описание урока 1', img: '/images/lesson1.jpg', price: 1000 },
    { id: 2, title: 'Урок 2', description: 'Описание урока 2', img: '/images/lesson2.jpg', price: 1500 },
    { id: 3, title: 'Урок 3', description: 'Описание урока 3', img: '/images/lesson3.jpg', price: 2000 }
  ]
  return (
    <div>
      <div className="bg-[#1B1B27] h-120 w-full flex">
        <div className="">
          <h1 className="">Уникальные украшения</h1>
          <h4 className="text-end">и сувениры из смолы</h4>
          <p className="text-start">
            Ювелирные украшения, оригинальные сувениры на память и незабываемые подарки в единственном экземпляре!
          </p>
          <PinkButton text="В каталог" />
        </div>
      </div>

      <div>
        <h2>Настоящая красота здесь!</h2>
        <p>Выберите категорию</p>
        <div></div>
      </div>
      <div>
        <h2>Галерея</h2>
        <p>
          Посмотрите парочку видео о том, как получаются готовые изделия и как я упаковываю покупки. Фото популярных
          товаров и новинок, а также отзывы покупателей и свеженькие акции.
        </p>
        <div></div>
      </div>
      <div>
        <h2>Об украшениях</h2>
        <div className="flex items-center gap-7 mb-3 leading-6">
          <ProductCard product={{ title: 'Как это сделано', image: '/images/product1.jpg' }} />
          <ProductCard product={{ title: 'Из чего это сделано', image: '/images/product2.jpg' }} />
          <ProductCard product={{ title: 'Правила хранения', image: '/images/product3.jpg' }} />
        </div>
      </div>

      <div>
        <h2>Блог</h2>
        <div></div>
        <div></div>
      </div>

      <div>
        <h2>Обучение</h2>
        <div>
          <div>
            <img src="/images/oplata.svg" alt="Оплата" className="w-19 h-18" />
            <h6>Оплата</h6>
            <p>Нажмите кнопку “Купить”</p>
            <p>Заполните форму заказа</p>
            <p>Выберите подходящий способ оплаты</p>
          </div>
          <div>
            <img src="/images/avtorizatsiya.svg" alt="Авторизация" className="w-18 h-18" />
            <h6>Авторизация</h6>
            <p>Укажите своё имя</p>
            <p>Укажите свой E-mail</p>
            <p>Нажмите кнопку “Отправить”</p>
          </div>
          <div>
            <img src="/images/dostup.svg" alt="Доступ" className="w-19 h-19" />
            <h6>Доступ</h6>
            <p>Получите ссылку на видео</p>
            <p>Смотрите новое обучающее видео</p>
            <p>Создавайте свои шедевры</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-7">
          {lessons.map(lesson => {
            return (
              <LessonCard key={lesson.id} lesson={lesson} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
