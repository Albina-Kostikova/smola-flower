import { products } from '@/features/products'

type Props = {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: Props) {
  const productId = Number(params.id)
  const product = products.find(item => item.id === productId)

  if (!product) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-(--color-primary)">Товар не найден</h1>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-(--color-primary)">{product.title}</h1>
      <p className="mt-3 text-slate-600">{product.description}</p>
      <p className="mt-3 text-(--color-primary) font-semibold">{product.price} ₽</p>
    </section>
  )
}
