'use client'

import { useCartStore } from './cart.store'

export const CartSection = () => {
  const { totalCount, totalPrice, clearCart } = useCartStore()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-(--color-primary)">Корзина</h1>

      <div className="mt-4 rounded-xl border border-pink-200 p-4">
        <p className="text-slate-700">Товаров: {totalCount}</p>
        <p className="mt-2 text-slate-700">Сумма: {totalPrice} ₽</p>
        <button
          type="button"
          onClick={clearCart}
          className="mt-4 rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-medium text-white">
          Очистить корзину
        </button>
      </div>
    </section>
  )
}
