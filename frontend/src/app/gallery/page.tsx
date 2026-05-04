import { getAllProducts } from "@/shared/api";
import { getGalleryImages } from '@/features/gallery/getGalleryImages'
import { GallerySection } from "@/features/gallery";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

export default async function GalleryPage() {
  const products = await getAllProducts()
  const images = getGalleryImages(products)

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <GallerySection images={images} />
    </section>
  )
}