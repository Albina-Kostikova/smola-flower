'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 4000,
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !isAnimating) return null

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center transition-all duration-300 ${
        isAnimating ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
      onClick={() => {
        setIsAnimating(false)
        setTimeout(onClose, 300)
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col items-center text-center max-w-md mx-4 transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            type === 'success'
              ? 'bg-green-50'
              : 'bg-red-50'
          }`}
        >
          {type === 'success' ? (
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {type === 'success' ? 'Заказ отправлен!' : 'Ошибка'}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed">{message}</p>

        <button
          onClick={() => {
            setIsAnimating(false)
            setTimeout(onClose, 300)
          }}
          className={`mt-6 px-8 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            type === 'success'
              ? 'bg-(--color-primary) text-white hover:opacity-90'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {type === 'success' ? 'Отлично!' : 'Понятно'}
        </button>
      </div>
    </div>
  )
}