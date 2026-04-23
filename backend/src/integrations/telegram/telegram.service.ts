import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { OrderNotification } from './types/order-notification.type'

@Injectable()
export class TelegramService {
  private token: string
  private chatId: string

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN')
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID')

    if (!token) throw new Error('Missing TELEGRAM_BOT_TOKEN')
    if (!chatId) throw new Error('Missing TELEGRAM_CHAT_ID')

    this.token = token
    this.chatId = chatId
  }

  async sendOrderNotification(order: OrderNotification & { id?: string }): Promise<void> {
    const message = this.formatOrderMessage(order)

    try {
      await axios.post(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚚 Shipped',
                callback_data: `order_shipped_${order.id}`,
              },
              {
                text: '✅ Done',
                callback_data: `order_done_${order.id}`,
              },
            ],
            [
              {
                text: '❌ Cancel',
                callback_data: `order_cancel_${order.id}`,
              },
            ],
          ],
        },
      })
    } catch (err: any) {
      console.error(
        'Telegram error:',
        err?.response?.data || err.message,
      )
    }
  }

  private formatOrderMessage(order: OrderNotification): string {
    const productsText = order.products
      .map(p => `- ${p.name} × ${p.quantity}`)
      .join('\n')

    return `
📦 НОВЫЙ ЗАКАЗ ${order.id ? `#${order.id}` : ''}

👤 Имя: ${order.name}
📞 Телефон: ${order.phone}
📧 Email: ${order.email}
🏠 Адрес: ${order.address}

🚚 Доставка: ${order.delivery}
💳 Оплата: ${order.payment}

🛍 Товары:
${productsText}

💰 Сумма: ${order.total}€
`
  }
}