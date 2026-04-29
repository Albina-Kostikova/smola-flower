import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

export default function DeliveryPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <div className="flex mb-25 gap-8">
        <div className="flex flex-col gap-10 max-w-111">
          <div>
            <h4 className="tall tracking-wider font-extrabold scale-y-110 text-2xl">Доставка</h4>
            <p className="mt-6 mb-5 font-bold">Мы отправляем товары следующими способами:</p>
            <ul className="list-disc pl-5">
              <li>Самовывоз по Бугульме</li>
              <li>Ozon, WB, Yandex - 300 руб</li>
              <li>Почта России - 250 руб</li>
            </ul>
          </div>
          <div>
            <h4 className="tall tracking-wider font-extrabold scale-y-110 text-2xl">Оплата</h4>
            <p className="mt-6 mb-5 font-bold">Вы можете оплатить товар следующими способами:</p>
            <ul className="list-disc pl-5">
              <li>Перевод (СБП)</li>
              <li>Наличный расчет</li>
              <li>Другое</li>
            </ul>
          </div>
          <p className="text-gray-700">Если Вы из Бугульмы, то можете забрать свои заказы по предварительной договоренности по адресу, высланному 
после предоплаты.</p>
        </div>
        <div className="flex flex-col justify-between max-w-111">
          <img src="/images/delivery.png" alt="Карта" className="w-111"/>
          <p className="text-gray-700">Срок сбора и отправки посылки — 3 рабочих дня.
Сроки ориентировочные и для вашего города они могут 
немного уменьшаться или увеличиваться.</p>
        </div>
      </div>
    </section>
  )
}