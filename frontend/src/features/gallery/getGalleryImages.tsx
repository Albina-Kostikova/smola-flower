import type { GalleryImage } from './types'

export function getGalleryImages(products: any[]): GalleryImage[] {
  return products.flatMap((product) => {
    const images = [product.img, product.img2, product.img3].filter(Boolean)
    return images.map((img: string) => ({
      url: img,
      productId: product.id,
      title: product.title
    }))
  })
}