
import Link from 'next/link'


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
        <img src="./images/logosf.svg" alt="Smola Flowers" className="w-25 h-13 contain" />
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
          <img className="w-5 h-5 contain" src='./images/soc-instagram.svg' alt="instagram" />
          <p>@smola_flower</p>
        </Link>
        <Link href="tel:+79375962726" className="flex items-center gap-2">
          <img className="w-5 h-5 contain" src='./images/soc-phone.svg' alt="phone" />
          <p>+7 (937) 596-27-26</p>
        </Link>
        <Link href="mailto:smola_flower@gmail.com" className="flex items-center gap-2">
          <img className="w-5 h-5 contain" src='./images/soc-email.svg' alt="email" />
          <p>smola_flower@gmail.com</p>
        </Link>
      </div>
      <div className="border-t border-white w-full"></div>
      <div className="text-center">© 2026 все права защищены</div>
    </footer>
  )
}
export default Footer
