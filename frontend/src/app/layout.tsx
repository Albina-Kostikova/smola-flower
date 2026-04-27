'use client'
import Header from '@/widgets/Header'
import Footer from '@/widgets/Footer'
import '../styles/globals.css'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { useState } from 'react'
import { CartSection } from '@/features/cart/CartSection'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  return (
    <html lang="ru">
      <body className="flex flex-col min-h-screen">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="grow flex flex-col justify-center">{children}</main>
        <CartSection isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>
        <Footer />
      </body>
    </html>
  )
}
