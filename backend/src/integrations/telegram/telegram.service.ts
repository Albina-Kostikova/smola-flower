import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './products.entity'
import axios from 'axios'
@Injectable()
export class TelegramService {
  private token = 'TELEGRAM_BOT_TOKEN'
  private chatId = 'TELEGRAM_CHAT_ID'

  async sendOrderNotification(orderData: any): Promise<void> {
    const message = this.formatOrderMessage(orderData)
    await this.sendMessage(message)
  }

  private formatOrderMessage(orderData: any): string {
    // Implementation for formatting the order message
    return `Получен новый заказ: ${orderData.name}`
  }

  private async sendMessage(message: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`
    await axios.post(url, {
      chat_id: this.chatId,
      text: message
    })
  }

}