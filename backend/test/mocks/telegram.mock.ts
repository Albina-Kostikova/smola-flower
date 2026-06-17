import { jest } from '@jest/globals'

export const mockTelegramService = {
  sendOrderNotification: jest.fn(),
  sendCommentNotification: jest.fn(),
}