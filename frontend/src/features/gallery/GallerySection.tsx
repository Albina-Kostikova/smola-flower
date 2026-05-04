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
    <div className="relative flex">
      <div
        className={`transition-all duration-300 ${
          active ? 'w-[calc(100%-420px)]' : 'w-full'
        }`}
      >
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.productId}-${index}`}
              className="break-inside-avoid mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image.url}
                alt={image.title}
                width={300}
                height={400}
                className="w-full rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div className="w-100 min-h-screen border-l border-gray-200 bg-white p-6 overflow-y-auto sticky top-0 self-start">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Просмотр</h2>
            <button
              onClick={handleClose}
              className="text-2xl cursor-pointer hover:opacity-70"
            >
              ✕
            </button>
          </div>

          <Image
            src={active.url}
            alt={active.title}
            width={400}
            height={500}
            className="w-full rounded-2xl object-cover mb-4"
          />

          <h3 className="text-lg font-semibold mb-2">{active.title}</h3>
          <PinkButton onClick={handleGoToProduct} text="Перейти к товару" />
        </div>
      )}
    </div>
  )
}