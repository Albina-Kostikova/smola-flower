import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))

    expect(result.current).toBe('hello')
  })

  it('does not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: {
          value: 'hello',
          delay: 500,
        },
      }
    )

    rerender({
      value: 'world',
      delay: 500,
    })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('hello')
  })

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: {
          value: 'hello',
          delay: 500,
        },
      }
    )

    rerender({
      value: 'world',
      delay: 500,
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('world')
  })

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: {
          value: 'a',
          delay: 500,
        },
      }
    )

    rerender({
      value: 'ab',
      delay: 500,
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({
      value: 'abc',
      delay: 500,
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toBe('a')

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('abc')
  })

  it('works with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: {
          value: 'first',
          delay: 1000,
        },
      }
    )

    rerender({
      value: 'second',
      delay: 1000,
    })

    act(() => {
      jest.advanceTimersByTime(999)
    })

    expect(result.current).toBe('first')

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current).toBe('second')
  })

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const { unmount } = renderHook(() =>
      useDebounce('hello', 500)
    )

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('updates correctly when delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      {
        initialProps: {
          value: 'hello',
          delay: 1000,
        },
      }
    )

    rerender({
      value: 'world',
      delay: 200,
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toBe('world')
  })
})