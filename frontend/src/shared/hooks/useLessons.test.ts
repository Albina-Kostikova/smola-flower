import { renderHook, act, waitFor } from '@testing-library/react'
import { useAllLessons, useLesson } from './useLessons'

jest.mock('../api/lessons', () => ({
  getAllLessons: jest.fn(),
  getLessonById: jest.fn(),
}))

import { getAllLessons, getLessonById } from '../api/lessons'

const mockedGetAllLessons = getAllLessons as jest.Mock
const mockedGetLessonById = getLessonById as jest.Mock

describe('useAllLessons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns lessons on successful fetch', async () => {
    const mockLessons = [
      {
        id: '1',
        title: 'Урок 1',
        description: 'Описание 1',
        content: 'Контент 1',
        imageUrl: '/img1.jpg',
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        title: 'Урок 2',
        description: 'Описание 2',
        content: 'Контент 2',
        imageUrl: '/img2.jpg',
        createdAt: '2024-01-02',
      },
    ]
    mockedGetAllLessons.mockResolvedValueOnce(mockLessons)

    const { result } = renderHook(() => useAllLessons())

    expect(result.current.loading).toBe(true)
    expect(result.current.lessons).toEqual([])
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.lessons).toEqual(mockLessons)
    expect(result.current.error).toBeNull()
  })

  it('sets error on fetch failure', async () => {
    const mockError = new Error('Failed to fetch')
    mockedGetAllLessons.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useAllLessons())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.lessons).toEqual([])
    expect(result.current.error).toEqual(mockError)
  })

  it('handles non-Error objects thrown as errors', async () => {
    mockedGetAllLessons.mockRejectedValueOnce('String error')

    const { result } = renderHook(() => useAllLessons())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(new Error('Unknown error'))
  })
})

describe('useLesson', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns lesson on successful fetch', async () => {
    const mockLesson = {
      id: '1',
      title: 'Урок 1',
      description: 'Описание 1',
      content: 'Контент 1',
      imageUrl: '/img1.jpg',
      createdAt: '2024-01-01',
    }
    mockedGetLessonById.mockResolvedValueOnce(mockLesson)

    const { result } = renderHook(() => useLesson('1'))

    expect(result.current.loading).toBe(true)
    expect(result.current.lesson).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.lesson).toEqual(mockLesson)
    expect(result.current.error).toBeNull()
  })

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useLesson(''))

    expect(mockedGetLessonById).not.toHaveBeenCalled()
    expect(result.current.lesson).toBeNull()
  })

  it('sets error on fetch failure', async () => {
    const mockError = new Error('Failed to fetch')
    mockedGetLessonById.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useLesson('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.lesson).toBeNull()
    expect(result.current.error).toEqual(mockError)
  })

  it('refetches when id changes', async () => {
    const mockLesson1 = {
      id: '1',
      title: 'Урок 1',
      description: 'Описание 1',
      content: 'Контент 1',
      imageUrl: '/img1.jpg',
      createdAt: '2024-01-01',
    }
    const mockLesson2 = {
      id: '2',
      title: 'Урок 2',
      description: 'Описание 2',
      content: 'Контент 2',
      imageUrl: '/img2.jpg',
      createdAt: '2024-01-02',
    }

    mockedGetLessonById.mockResolvedValueOnce(mockLesson1)
    mockedGetLessonById.mockResolvedValueOnce(mockLesson2)

    const { result, rerender } = renderHook(({ id }: { id: string }) => useLesson(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.lesson).toEqual(mockLesson1)
    })

    rerender({ id: '2' })

    await waitFor(() => {
      expect(result.current.lesson).toEqual(mockLesson2)
    })

    expect(mockedGetLessonById).toHaveBeenCalledTimes(2)
  })
})
