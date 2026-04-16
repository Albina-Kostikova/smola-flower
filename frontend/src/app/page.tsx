import { ProductCard } from '@/entities/product'
import { PinkButton } from '@/shared/ui/Buttons'

export default function Home() {
  return (
    <div>
      <div className="bg-[#1B1B27] h-119.2 flex">
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

      <div></div>

      <div></div>
    </div>
  )
}
