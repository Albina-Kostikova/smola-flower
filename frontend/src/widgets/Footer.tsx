import Image from 'next/image'
import Link from 'next/link'
import instagramImg from '@/shared/images/soc-instagram.svg'
import phoneImg from '@/shared/images/soc-phone.svg'
import emailImg from '@/shared/images/soc-email.svg'
import logoImg from '@/shared/images/logosf.svg'

const Footer = () => {
  const navItems = [
    { href: '/catalog', label: 'Каталог' },
    { href: '/aboutProducts', label: 'Об украшениях' },
    { href: '/gallery', label: 'Галерея' },
    { href: '/delivery', label: 'Доставка и оплата' },
    { href: '/blog', label: 'Блог' },
    { href: '/courses', label: 'Обучение' },
  ]
  return (
    <footer className="flex flex-col gap-3 items-center justify-center py-5 border-t bg-(--color-primary) text-white">
      <Link href="/" className="text-xl font-semibold tracking-tight ">
        <Image src={logoImg} alt="Smola Flowers" className="w-25 h-13 contain" />
      </Link>
      <div className="flex items-center gap-12 whitespace-nowrap text-white uppercase">
        {navItems.map(item => {
          return (
            <Link key={item.href} href={item.href} className="py-2 text-base font-medium  transition ">
              {item.label}
            </Link>
          )
        })}
      </div>
      <div className="flex items-center justify-center gap-10 mb-3 leading-6">
        <Link href="https://www.instagram.com/smola_flower" className="flex items-center gap-2">
          <Image className="w-5 h-5 contain" src={instagramImg} alt="instagram" />
          <p>@smola_flower</p>
        </Link>
        <Link href="tel:+79375962726" className="flex items-center gap-2">
          <Image className="w-5 h-5 contain" src={phoneImg} alt="phone" />
          <p>+7 (937) 596-27-26</p>
        </Link>
        <Link href="mailto:smola_flower@gmail.com" className="flex items-center gap-2">
          <Image className="w-5 h-5 contain" src={emailImg} alt="email" />
          <p>smola_flower@gmail.com</p>
        </Link>
      </div>
      <div className="border-t border-white w-full"></div>
      <div className="text-center">© 2026 все права защищены</div>
    </footer>
  )
}
export default Footer
