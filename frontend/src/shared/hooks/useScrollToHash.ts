'use client'

import { useEffect } from 'react'

export const useScrollToHash = (isLoading: boolean) => {
  useEffect(() => {
  if (isLoading) return

  const hash = window.location.hash.replace('#', '')
  if (!hash) return

  const tryScroll = () => {
    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      return true
    }
    return false
  }

  let attempts = 0

  const interval = setInterval(() => {
    const done = tryScroll()

    attempts++
    if (done || attempts > 20) {
      clearInterval(interval)
    }
  }, 100)

  return () => clearInterval(interval)
}, [isLoading])
}