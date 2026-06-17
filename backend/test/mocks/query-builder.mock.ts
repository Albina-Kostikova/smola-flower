type QueryResult<T> = { data: T | null; error: Error | null }

export const createQueryMock = <T>(result: QueryResult<T>) => {
  const query = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(result),
    then: jest.fn((onFulfilled: (value: QueryResult<T>) => any) => {
      return Promise.resolve(onFulfilled(result))
    }),
    catch: jest.fn((onRejected: (reason: any) => any) => {
      return Promise.resolve(result)
    }),
  }
  return query
}