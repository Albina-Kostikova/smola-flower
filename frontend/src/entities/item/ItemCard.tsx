import { Item } from './types'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  item: Item
}

export const ItemCard = ({ item }: Props) => {
  return (
    <Link href={item.src} className="relative rounded-4xl w-87 h-87 text-white overflow-hidden">
      <Image
        src={item.img}
        alt={item.title}
        className="inset-0 rounded-inherit object-cover"
        width={348} height={348}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#222_0%,#222_10%,rgba(34,34,34,0)_50%,rgba(34,34,34,0)_100%)]" />
      <h3 className="z-10 absolute bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-2xl font-bold mb-2 tall uppercase tracking-wide scale-x-90 ">
        {item.title}
      </h3>
    </Link>
  )
}
