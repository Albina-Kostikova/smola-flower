'use client'
import { useEffect } from 'react'

export const useScrollToHash = () => {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')

    if (!hash) return

    const el = document.getElementById(hash)

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])
}