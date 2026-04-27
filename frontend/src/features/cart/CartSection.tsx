'use client'

import { Item } from '@/entities/item/types'
import { useCartStore } from './cart.store'
import { PinkButton } from '@/shared/ui/Buttons'

export const CartSection = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  const { totalCount, totalPrice, clearCart } = useCartStore()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="relative w-full flex items-center border-b border-gray-300 mb-8">
        <h2>Корзина</h2>
        <img src="./images/cart-close.svg" alt="Закрыть" className="absolute h-8 w-8"/>
        </div>
      <div>
        <div></div>
        <div>
          <h3 className="tall tracking-wide scale-x-95">Выбранный товапр</h3>
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="border-t border-gray-700 py-6 pl-3 flex items-center justify-between">
                <img src="" alt={item.title} className="h-20 w-20 rounded-2xl object-cover " />
                <div className=" ml-5">
                  <h4 className="">{item.title}</h4>
                  <h5 className="tall tracking-wide scale-x-95">{item.price} ₽</h5>
                </div>
                <button title="cart-close">
                  <img alt="Удалить" src="./images/cart-close.svg" />
                </button>
              </div>
            ))}
          </div>
          <div className="text-end py-5">
            <h5 className="tall">Итого: {totalPrice}</h5>
            <p>{order.delivery}</p>
          </div>
          <div className="border-t border-gray-300">
            <h5 className="tall">Итоговая сумма: {totalPrice}</h5>
          </div>
          <div>
            <PinkButton onClick={sendOrder} text="Оформить заказ" />
            <p>
              Нажимая на кнопку, вы подтверждаете, что ознакомились с <a href="">политикой конфиденциальности</a> и
              даете согласие на <a href="">обработку своих персональных данных</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
