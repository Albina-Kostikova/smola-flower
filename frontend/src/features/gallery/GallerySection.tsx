'use client'
import type { GalleryImage } from './types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PinkButton } from '@/shared/ui/Buttons'

type Props = {
  images: GalleryImage[]
}

export function GallerySection({ images }: Props) {
  const [active, setActive] = useState<GalleryImage | null>(null)
  const router = useRouter()

  const handleImageClick = (image: GalleryImage) => {
    setActive(image)
  }

  const handleClose = () => {
    setActive(null)
  }

  const handleGoToProduct = () => {
    if (active) {
      router.push(`/catalog/${active.productId}`)
    }
  }

  return (
    <div className="relative flex flex-col lg:flex-row">
      <div className={`transition-all duration-300 ${active ? 'w-full lg:w-[calc(100%-420px)]' : 'w-full'}`}>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.productId}-${index}`}
              className="break-inside-avoid mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(image)}>
              <Image
                src={image.url}
                alt={image.title}
                width={300}
                height={400}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full rounded-2xl object-cover"
                loading={index < 4 ? undefined : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 lg:hidden"
          onClick={handleClose}>
          <div
            className="w-full max-w-md rounded-2xl border border-(--color-secondary) bg-white p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <h2 className="text-lg font-semibold">{active.title}</h2>
              <button onClick={handleClose} className="text-2xl cursor-pointer hover:opacity-70">
                ✕
              </button>
            </div>

            <Image
              src={active.url}
              alt={active.title}
              width={400}
              height={500}
              className="w-full rounded-2xl object-cover mb-4"
              priority
            />

            <PinkButton onClick={handleGoToProduct} text="Перейти к товару" />
          </div>
        </div>
      )}

      {active && (
        <div className="hidden lg:block w-100 rounded-2xl border border-(--color-secondary) ml-5 bg-white p-6 overflow-y-auto sticky top-0 self-start">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h2 className="text-xl font-semibold">{active.title}</h2>
            <button onClick={handleClose} className="text-2xl cursor-pointer hover:opacity-70">
              ✕
            </button>
          </div>

          <Image
            src={active.url}
            alt={active.title}
            width={400}
            height={500}
            className="w-full rounded-2xl object-cover mb-4"
            priority
          />

          <PinkButton onClick={handleGoToProduct} text="Перейти к товару" />
        </div>
      )}
    </div>
  )
}
