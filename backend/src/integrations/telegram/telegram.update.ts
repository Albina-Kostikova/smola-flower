import { Update, Start, Command, Ctx, Action, On } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { OrdersService } from '../../modules/orders/orders.service'
import { ProductService } from '../../modules/products/products.service'
import { NotesService } from '../../modules/notes/notes.service'

interface NoteCreationState {
  step: 'title' | 'text' | 'img' | 'date'
  title?: string
  text?: string
  img?: string
  date?: string
}

@Update()
export class TelegramUpdate {
  private noteCreationStates: Map<number, NoteCreationState> = new Map()

  constructor(
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
    @Inject(forwardRef(() => ProductService))
    private productsService: ProductService,
    @Inject(forwardRef(() => NotesService))
    private notesService: NotesService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      `🌸 SMOLA Flowers — Админ-панель

Команды для статей:
/notes — список всех статей
/addnote — создать статью (пошагово)

Команды для комментариев:
/comments — последние комментарии

Быстрое создание статьи:
/addnote Название | Текст | https://картинка.jpg | 2024-03-15

Другие команды:
/orders — все заказы
/products — все товары`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📝 Создать статью', callback_data: 'add_note' }],
            [{ text: '📋 Список статей', callback_data: 'list_notes' }],
            [{ text: '💬 Комментарии', callback_data: 'list_comments' }],
            [{ text: '📦 Заказы', callback_data: 'list_orders' }],
          ],
        },
      },
    )
  }


  @Command('notes')
  async getNotes(@Ctx() ctx: Context) {
    const notes = await this.notesService.findAll()

    if (notes.length === 0) {
      await ctx.reply('📭 Нет статей')
      return
    }

    for (const note of notes.slice(0, 10)) {
      const title = note.title
      const date = new Date(note.created_at).toLocaleDateString('ru-RU')
      const preview = note.text?.slice(0, 100) || ''

      await ctx.reply(
        `📝 *${title}*\n📅 ${date}\n\n${preview}...`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '👁 Посмотреть', callback_data: `view_note_${note.id}` },
                { text: '🗑 Удалить', callback_data: `delete_note_${note.id}` },
              ],
            ],
          },
        },
      )
    }
  }

  @Command('addnote')
  async addNote(@Ctx() ctx: Context) {
    const text = (ctx as any).message?.text || ''
    const data = text.replace('/addnote', '').trim()

    if (data) {
      const parts = data.split('|').map((p: string) => p.trim())
      const title = parts[0]
      const content = parts[1] || ''
      const img = parts[2] || 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop'
      const dateStr = parts[3]

      if (!title) {
        await ctx.reply('❌ Укажите хотя бы название. Пример:\n/addnote Название | Текст статьи | https://картинка.jpg')
        return
      }

      const note = await this.notesService.create({
        title,
        text: content,
        img,
        date: dateStr ? new Date(dateStr) : new Date(),
        created_at: new Date(),
      })

      const createdDate = new Date(note.created_at).toLocaleDateString('ru-RU')
      await ctx.reply(
        `✅ Статья создана!\n\n📝 *${note.title}*\n📅 ${createdDate}`,
        { parse_mode: 'Markdown' },
      )
    } else {
      const chatId = (ctx as any).chat?.id
      if (chatId) {
        this.noteCreationStates.set(chatId, { step: 'title' })
        await ctx.reply('📝 Шаг 1 из 4\n\nВведите *название статьи*:', { parse_mode: 'Markdown' })
      }
    }
  }

  @On('text')
  async handleNoteCreation(@Ctx() ctx: Context) {
    const chatId = (ctx as any).chat?.id
    const state = chatId ? this.noteCreationStates.get(chatId) : undefined
    if (!state) return

    const text = (ctx as any).message?.text || ''

    switch (state.step) {
      case 'title':
        state.title = text
        state.step = 'text'
        await ctx.reply(
          '📝 Шаг 2 из 4\n\nВведите *текст статьи*:',
          { parse_mode: 'Markdown' },
        )
        break

      case 'text':
        state.text = text
        state.step = 'img'
        await ctx.reply(
          '📝 Шаг 3 из 4\n\nОтправьте *ссылку на картинку* или "нет":',
          { parse_mode: 'Markdown' },
        )
        break

      case 'img':
        state.img = text === 'нет'
          ? 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop'
          : text
        state.step = 'date'
        await ctx.reply(
          '📝 Шаг 4 из 4\n\nВведите *дату* ГГГГ-ММ-ДД или "сегодня":',
          { parse_mode: 'Markdown' },
        )
        break

      case 'date':
        state.date = text === 'сегодня' ? new Date().toISOString().split('T')[0] : text

        const note = await this.notesService.create({
          title: state.title,
          text: state.text,
          img: state.img || 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop',
          date: state.date ? new Date(state.date) : new Date(),
          created_at: new Date(),
        })

        this.noteCreationStates.delete(chatId)

        const createdDate = new Date(note.created_at).toLocaleDateString('ru-RU')
        await ctx.reply(
          `✅ Статья создана!\n\n📝 *${note.title}*\n📅 ${createdDate}`,
          { parse_mode: 'Markdown' },
        )
        break
    }
  }

  @Command('comments')
  async getComments(@Ctx() ctx: Context) {
    const notes = await this.notesService.findAll()

    if (notes.length === 0) {
      await ctx.reply('📭 Нет статей с комментариями')
      return
    }

    for (const note of notes.slice(0, 5)) {
      try {
        const axios = require('axios')
        const apiUrl = process.env.API_URL || 'http://localhost:3001'
        const commentsRes = await axios.get(`${apiUrl}/notes/${note.id}/comments`)
        const comments = commentsRes.data

        await ctx.reply(
          `📝 *${note.title}*\n💬 Комментариев: ${comments.length}`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: `👁 Показать комментарии (${comments.length})`, callback_data: `view_comments_${note.id}` }],
              ],
            },
          },
        )
      } catch {
      }
    }
  }

  @Action('add_note')
  async actionAddNote(@Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    const chatId = (ctx as any).chat?.id
    if (chatId) {
      this.noteCreationStates.set(chatId, { step: 'title' })
      await ctx.reply('📝 Шаг 1 из 4\n\nВведите *название статьи*:', { parse_mode: 'Markdown' })
    }
  }

  @Action('list_notes')
  async actionListNotes(@Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    await this.getNotes(ctx)
  }

  @Action('list_comments')
  async actionListComments(@Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    await this.getComments(ctx)
  }

  @Action('list_orders')
  async actionListOrders(@Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    const orders = await this.ordersService.findAll()
    const text = orders
      .map(o => `#${o.id} | ${o.name} | ${o.total}₽ | ${o.status}`)
      .join('\n')
    await ctx.reply(text || 'Нет заказов')
  }

  @Action(/view_note_(.+)/)
  async actionViewNote(@Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      const note = await this.notesService.findOne(id)
      await ctx.replyWithPhoto(note.img, {
        caption: `📝 *${note.title}*\n\n📅 ${new Date(note.created_at).toLocaleDateString('ru-RU')}\n\n${note.text}`,
        parse_mode: 'Markdown',
      })
    } catch {
      await ctx.reply('❌ Статья не найдена')
    }
  }

  @Action(/delete_note_(.+)/)
  async actionDeleteNote(@Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      await this.notesService.delete(id)
      await ctx.reply('🗑 Статья удалена')
    } catch {
      await ctx.reply('❌ Ошибка удаления')
    }
  }

  @Action(/view_comments_(.+)/)
  async actionViewComments(@Ctx() ctx: Context) {
    await ctx.answerCbQuery()
    const noteId = (ctx as any).match?.[1]
    if (!noteId) return

    try {
      const note = await this.notesService.findOne(noteId)
      const axios = require('axios')
      const apiUrl = process.env.API_URL || 'http://localhost:3001'
      const commentsRes = await axios.get(`${apiUrl}/notes/${noteId}/comments`)
      const comments = commentsRes.data

      if (comments.length === 0) {
        await ctx.reply(`📝 *${note.title}*\n\n💬 Нет комментариев`, { parse_mode: 'Markdown' })
        return
      }

      let msg = `💬 Комментарии к «${note.title}»:\n\n`
      for (const c of comments) {
        const icon = c.is_owner ? '👑' : '👤'
        msg += `${icon} *${c.name}*: ${c.text}\n`
      }

      if (msg.length > 4000) {
        const parts = msg.match(/[\s\S]{1,4000}/g) || []
        for (const part of parts) {
          await ctx.reply(part, { parse_mode: 'Markdown' })
        }
      } else {
        await ctx.reply(msg, { parse_mode: 'Markdown' })
      }
    } catch {
      await ctx.reply('❌ Ошибка')
    }
  }

  @Command('orders')
  async getOrders(@Ctx() ctx: Context) {
    const orders = await this.ordersService.findAll()
    const text = orders
      .map(o => `#${o.id} | ${o.name} | ${o.total}₽ | ${o.status}`)
      .join('\n')
    await ctx.reply(text || 'Нет заказов')
  }

  @Command('products')
  async getProducts(@Ctx() ctx: Context) {
    const products = await this.productsService.findAll()
    const text = products
      .map((p: any) => `${p.id} | ${p.title} | ${p.price}₽`)
      .join('\n')
    await ctx.reply(text || 'Нет товаров')
  }

  @Action(/order_shipped_(.+)/)
  async shipped(@Ctx() ctx: Context) {
    const id = (ctx as any).match?.[1]
    await this.ordersService.update(id, { status: 'shipped' })
    await ctx.reply(`🚚 Order ${id} shipped`)
  }

  @Action(/order_done_(.+)/)
  async done(@Ctx() ctx: Context) {
    const id = (ctx as any).match?.[1]
    await this.ordersService.update(id, { status: 'done' })
    await ctx.reply(`✅ Order ${id} done`)
  }

  @Action(/order_cancel_(.+)/)
  async cancel(@Ctx() ctx: Context) {
    const id = (ctx as any).match?.[1]
    await this.ordersService.update(id, { status: 'canceled' })
    await ctx.reply(`❌ Order ${id} canceled`)
  }
}