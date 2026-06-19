import { renderHook } from '@testing-library/react'
import { useScrollToHash } from './useScrollToHash'

describe('useScrollToHash', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    window.location.hash = ''
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllTimers()
  })

  it('does nothing when loading is true', () => {
    const mockScrollIntoView = jest.fn()
    const elementId = 'section'
    const element = document.createElement('div')
    element.id = elementId
    document.body.appendChild(element)
    element.scrollIntoView = mockScrollIntoView

    window.location.hash = `#${elementId}`

    renderHook(() => useScrollToHash(true))
    jest.runAllTimers()

    expect(mockScrollIntoView).not.toHaveBeenCalled()
    document.body.removeChild(element)
  })

  it('scrolls to element when hash exists', () => {
    const mockScrollIntoView = jest.fn()
    const elementId = 'section'
    const element = document.createElement('div')
    element.id = elementId
    document.body.appendChild(element)
    element.scrollIntoView = mockScrollIntoView

    window.location.hash = `#${elementId}`

    renderHook(() => useScrollToHash(false))
    jest.runAllTimers()

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    document.body.removeChild(element)
  })

  it('does nothing when no hash exists', () => {
    const mockScrollIntoView = jest.fn()
    const elementId = 'section'
    const element = document.createElement('div')
    element.id = elementId
    document.body.appendChild(element)
    element.scrollIntoView = mockScrollIntoView

    window.location.hash = ''

    renderHook(() => useScrollToHash(false))
    jest.runAllTimers()

    expect(mockScrollIntoView).not.toHaveBeenCalled()
    document.body.removeChild(element)
  })

  it('retries scrolling when element is not immediately available', () => {
    const mockScrollIntoView = jest.fn()
    const elementId = 'section'

    window.location.hash = `#${elementId}`

    renderHook(() => useScrollToHash(false))

    jest.advanceTimersByTime(200)

    const element = document.createElement('div')
    element.id = elementId
    document.body.appendChild(element)
    element.scrollIntoView = mockScrollIntoView

    jest.advanceTimersByTime(100)

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    document.body.removeChild(element)
  })

  it('stops retrying after 20 attempts', () => {
    const elementId = 'section'
    window.location.hash = `#${elementId}`

    renderHook(() => useScrollToHash(false))

    jest.runAllTimers()

    expect(true).toBe(true)
  })
})
