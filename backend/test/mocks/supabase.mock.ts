import { jest } from '@jest/globals'

export const createSupabaseMock = () => {
  const client = {
    from: jest.fn(),
  }

  return {
    client,
    service: {
      getClient: jest.fn(() => client),
    },
  }
}