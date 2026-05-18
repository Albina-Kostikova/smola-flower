import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import Image from 'next/image'

export default function DeliveryPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <div className="flex flex-col lg:flex-row mb-12 lg:mb-25 gap-6 lg:gap-8">
        <div className="flex flex-col gap-6 lg:gap-10 w-full lg:max-w-111">
          <div>
            <h4 className="tall tracking-wider font-extrabold scale-y-110 text-xl lg:text-2xl">Доставка</h4>
            <p className="mt-4 lg:mt-6 mb-3 lg:mb-5 font-bold">Мы отправляем товары следующими способами:</p>
            <ul className="list-disc pl-5">
              <li>Самовывоз по Бугульме</li>
              <li>Ozon, WB, Yandex - 300 руб</li>
              <li>Почта России - 250 руб</li>
            </ul>
          </div>
          <div>
            <h4 className="tall tracking-wider font-extrabold scale-y-110 text-xl lg:text-2xl">Оплата</h4>
            <p className="mt-4 lg:mt-6 mb-3 lg:mb-5 font-bold">Вы можете оплатить товар следующими способами:</p>
            <ul className="list-disc pl-5">
              <li>Перевод (СБП)</li>
              <li>Наличный расчет</li>
              <li>Другое</li>
            </ul>
          </div>
          <p className="text-gray-700">
            Если Вы из Бугульмы, то можете забрать свои заказы по предварительной договоренности по адресу, высланному
            после предоплаты.
          </p>
        </div>
        <div className="flex flex-col justify-between w-full lg:max-w-111">
          <Image src="/images/delivery.png" alt="Карта" width={444} height={320} className="w-full h-auto" />
          <p className="text-gray-700 mt-4 lg:mt-0">
            Срок сбора и отправки посылки — 3 рабочих дня. Сроки ориентировочные и для вашего города они могут немного
            уменьшаться или увеличиваться.
          </p>
        </div>
      </div>
    </section>
  )
}
