import { Update, Start, Command, Ctx, Action, On } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { Injectable, Inject, forwardRef, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OrdersService } from '../../modules/orders/orders.service'
import { ProductService } from '../../modules/products/products.service'
import { NotesService } from '../../modules/notes/notes.service'
import { LessonsService } from '../../modules/lessons/lessons.service'

interface NoteCreationState {
  step: 'title' | 'text' | 'img' | 'date'
  title?: string
  text?: string
  img?: string
  date?: string
}

interface ProductCreationState {
  step: string
  title?: string
  img?: string
  price?: string
  category?: string
  technic?: string
  diameter?: string
  color?: string
  form?: string
  material?: string
  stock?: string
}

interface LessonCreationState {
  step: string
  title?: string
  url?: string
  description?: string
  img?: string
  price?: string
}

@Update()
export class TelegramUpdate {
  private noteCreationStates: Map<number, NoteCreationState> = new Map()
  private productCreationStates: Map<number, ProductCreationState> = new Map()
  private lessonCreationStates: Map<number, LessonCreationState> = new Map()
  private adminChatId: number

  constructor(
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
    @Inject(forwardRef(() => ProductService))
    private productsService: ProductService,
    @Inject(forwardRef(() => NotesService))
    private notesService: NotesService,
    @Inject(forwardRef(() => LessonsService))
    private lessonsService: LessonsService,
    private configService: ConfigService,
  ) {
    const chatIdStr = this.configService.get<string>('TELEGRAM_CHAT_ID')
    if (chatIdStr) {
      const parsed = parseInt(chatIdStr, 10)
      this.adminChatId = isNaN(parsed) ? 0 : parsed
    } else {
      this.adminChatId = 0
    }
  }

  private isAdmin(ctx: Context): boolean {
    const userId = (ctx as any).from?.id
    const chatId = (ctx as any).chat?.id
    return userId === this.adminChatId || chatId === this.adminChatId
  }

  private async checkAdmin(ctx: Context): Promise<boolean> {
    if (!this.isAdmin(ctx)) {
      await ctx.reply('⛔ Доступ запрещён. Вы не являетесь администратором.')
      return false
    }
    return true
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return

    await ctx.reply(
      `🌸 SMOLA Flowers — Админ-панель

Выберите раздел для управления:`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🛍 Товары', callback_data: 'menu_products' }],
            [{ text: '📚 Уроки', callback_data: 'menu_lessons' }],
            [{ text: '📝 Статьи', callback_data: 'menu_notes' }],
            [{ text: '📦 Заказы', callback_data: 'list_orders' }],
          ],
        },
      },
    )
  }

  // ===== МЕНЮ РАЗДЕЛОВ =====

  @Action('menu_products')
  async menuProducts(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    await ctx.reply('🛍 Управление товарами:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Список товаров', callback_data: 'list_products' }],
          [{ text: '➕ Создать товар', callback_data: 'add_product' }],
          [{ text: '◀️ Назад', callback_data: 'back_to_start' }],
        ],
      },
    })
  }

  @Action('menu_lessons')
  async menuLessons(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    await ctx.reply('📚 Управление уроками:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Список уроков', callback_data: 'list_lessons' }],
          [{ text: '➕ Создать урок', callback_data: 'add_lesson' }],
          [{ text: '◀️ Назад', callback_data: 'back_to_start' }],
        ],
      },
    })
  }

  @Action('menu_notes')
  async menuNotes(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    await ctx.reply('📝 Управление статьями:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Список статей', callback_data: 'list_notes' }],
          [{ text: '➕ Создать статью', callback_data: 'add_note' }],
          [{ text: '◀️ Назад', callback_data: 'back_to_start' }],
        ],
      },
    })
  }

  @Action('back_to_start')
  async backToStart(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    await this.start(ctx)
  }

  // ===== ТОВАРЫ =====

  @Action('list_products')
  async listProducts(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    try {
      const products = await this.productsService.getAllProducts()

      if (products.length === 0) {
        await ctx.reply('📭 Нет товаров')
        return
      }

      for (const product of products.slice(0, 10)) {
        const title = (product as any).title || 'Без названия'
        const price = (product as any).price || 'не указана'
        await ctx.reply(`🛍 *${title}*\n💰 ${price} руб.`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '👁 Посмотреть', callback_data: `view_product_${(product as any).id}` },
                { text: '🗑 Удалить', callback_data: `delete_product_${(product as any).id}` },
              ],
            ],
          },
        })
      }
    } catch {
      await ctx.reply('❌ Ошибка загрузки товаров')
    }
  }

  @Action('add_product')
  async addProduct(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const chatId = (ctx as any).chat?.id
    if (chatId) {
      this.productCreationStates.set(chatId, { step: 'title' })
      await ctx.reply('📝 Шаг 1 из 10\n\nВведите *название товара*:', { parse_mode: 'Markdown' })
    }
  }

  @Action(/view_product_(.+)/)
  async viewProduct(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      const product = await this.productsService.getProductById(id)
      const title = (product as any).title || 'Без названия'
      const price = (product as any).price || 'не указана'
      const category = (product as any).category || ''
      const material = (product as any).material || ''
      const img = (product as any).img || ''

      const info = `🛍 *${title}*\n💰 ${price} руб.\n📂 ${category}\n🧵 ${material}`

      if (img) {
        await ctx.replyWithPhoto(img, {
          caption: info,
          parse_mode: 'Markdown',
        })
      } else {
        await ctx.reply(info, { parse_mode: 'Markdown' })
      }
    } catch {
      await ctx.reply('❌ Товар не найден')
    }
  }

  @Action(/delete_product_(.+)/)
  async deleteProduct(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      await this.productsService.deleteProduct(id)
      await ctx.reply('🗑 Товар удалён')
    } catch {
      await ctx.reply('❌ Ошибка удаления')
    }
  }

  // ===== УРОКИ =====

  @Action('list_lessons')
  async listLessons(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    try {
      const lessons = await this.lessonsService.getAllLessons()

      if (lessons.length === 0) {
        await ctx.reply('📭 Нет уроков')
        return
      }

      for (const lesson of lessons.slice(0, 10)) {
        const title = (lesson as any).title || 'Без названия'
        const desc = (lesson as any).description || ''

        await ctx.reply(`📚 *${title}*\n${desc.slice(0, 100)}`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '👁 Посмотреть', callback_data: `view_lesson_${(lesson as any).id}` },
                { text: '🗑 Удалить', callback_data: `delete_lesson_${(lesson as any).id}` },
              ],
            ],
          },
        })
      }
    } catch {
      await ctx.reply('❌ Ошибка загрузки уроков')
    }
  }

  @Action('add_lesson')
  async addLesson(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const chatId = (ctx as any).chat?.id
    if (chatId) {
      this.lessonCreationStates.set(chatId, { step: 'title' })
      await ctx.reply('📝 Шаг 1 из 5\n\nВведите *название урока*:', { parse_mode: 'Markdown' })
    }
  }

  @Action(/view_lesson_(.+)/)
  async viewLesson(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      const lesson = await this.lessonsService.getLessonById(id)
      const title = (lesson as any).title || 'Без названия'
      const desc = (lesson as any).description || ''
      const price = (lesson as any).price || 'не указана'
      const img = (lesson as any).img || ''

      const info = `📚 *${title}*\n💰 ${price} руб.\n\n📖 ${desc}`

      if (img) {
        await ctx.replyWithPhoto(img, {
          caption: info,
          parse_mode: 'Markdown',
        })
      } else {
        await ctx.reply(info, { parse_mode: 'Markdown' })
      }
    } catch {
      await ctx.reply('❌ Урок не найден')
    }
  }

  @Action(/delete_lesson_(.+)/)
  async deleteLesson(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      await this.lessonsService.deleteLesson(id)
      await ctx.reply('🗑 Урок удалён')
    } catch {
      await ctx.reply('❌ Ошибка удаления')
    }
  }

  // ===== ОБРАБОТКА ТЕКСТА ДЛЯ СОЗДАНИЯ =====

  @On('text')
  async handleCreation(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    const chatId = (ctx as any).chat?.id
    if (!chatId) return

    const noteState = this.noteCreationStates.get(chatId)
    const productState = this.productCreationStates.get(chatId)
    const lessonState = this.lessonCreationStates.get(chatId)

    if (noteState) {
      await this.handleNoteCreation(ctx, chatId, noteState)
      return
    }

    if (productState) {
      await this.handleProductCreation(ctx, chatId, productState)
      return
    }

    if (lessonState) {
      await this.handleLessonCreation(ctx, chatId, lessonState)
      return
    }
  }

  private async handleNoteCreation(ctx: Context, chatId: number, state: NoteCreationState) {
    const text = (ctx as any).message?.text || ''

    switch (state.step) {
      case 'title':
        state.title = text
        state.step = 'text'
        await ctx.reply('📝 Шаг 2 из 4\n\nВведите *текст статьи*:', { parse_mode: 'Markdown' })
        break

      case 'text':
        state.text = text
        state.step = 'img'
        await ctx.reply('📝 Шаг 3 из 4\n\nОтправьте *ссылку на картинку* или "нет":', { parse_mode: 'Markdown' })
        break

      case 'img':
        state.img =
          text === 'нет' ? 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop' : text
        state.step = 'date'
        await ctx.reply('📝 Шаг 4 из 4\n\nВведите *дату* ГГГГ-ММ-ДД или "сегодня":', { parse_mode: 'Markdown' })
        break

      case 'date':
        state.date = text === 'сегодня' ? new Date().toISOString().split('T')[0] : text
        const note = await this.notesService.createNote({
          title: state.title,
          text: state.text,
          img: state.img || 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop',
          date: state.date ? new Date(state.date) : new Date(),
          created_at: new Date(),
        })
        this.noteCreationStates.delete(chatId)
        await ctx.reply(`✅ Статья создана!\n\n📝 *${note.title}*`, { parse_mode: 'Markdown' })
        break
    }
  }

  private async handleProductCreation(ctx: Context, chatId: number, state: ProductCreationState) {
    const text = (ctx as any).message?.text || ''

    switch (state.step) {
      case 'title':
        state.title = text
        state.step = 'img'
        await ctx.reply('📝 Шаг 2 из 10\n\nОтправьте *ссылку на картинку* или "нет":', { parse_mode: 'Markdown' })
        break

      case 'img':
        state.img = text === 'нет' ? '' : text
        state.step = 'price'
        await ctx.reply('📝 Шаг 3 из 10\n\nВведите *цену* (только число):', { parse_mode: 'Markdown' })
        break

      case 'price':
        state.price = text
        state.step = 'category'
        await ctx.reply('📝 Шаг 4 из 10\n\nВведите *категорию* товара:', { parse_mode: 'Markdown' })
        break

      case 'category':
        state.category = text
        state.step = 'technic'
        await ctx.reply('📝 Шаг 5 из 10\n\nВведите *технику*:', { parse_mode: 'Markdown' })
        break

      case 'technic':
        state.technic = text
        state.step = 'diameter'
        await ctx.reply('📝 Шаг 6 из 10\n\nВведите *диаметр*:', { parse_mode: 'Markdown' })
        break

      case 'diameter':
        state.diameter = text
        state.step = 'color'
        await ctx.reply('📝 Шаг 7 из 10\n\nВведите *цвет*:', { parse_mode: 'Markdown' })
        break

      case 'color':
        state.color = text
        state.step = 'form'
        await ctx.reply('📝 Шаг 8 из 10\n\nВведите *форму*:', { parse_mode: 'Markdown' })
        break

      case 'form':
        state.form = text
        state.step = 'material'
        await ctx.reply('📝 Шаг 9 из 10\n\nВведите *материал*:', { parse_mode: 'Markdown' })
        break

      case 'material':
        state.material = text
        state.step = 'stock'
        await ctx.reply('📝 Шаг 10 из 10\n\nВ наличии? (да/нет):', { parse_mode: 'Markdown' })
        break

      case 'stock':
        state.stock = text
        const product = await this.productsService.createProduct({
          title: state.title,
          img: state.img || '',
          price: state.price ? parseFloat(state.price) : 0,
          category: state.category || '',
          technic: state.technic || '',
          diameter: state.diameter || '',
          color: state.color || '',
          form: state.form || '',
          material: state.material || '',
          stock: text.toLowerCase() === 'да',
        } as any)
        this.productCreationStates.delete(chatId)
        await ctx.reply(`✅ Товар создан!\n\n🛍 *${product.title}*`, { parse_mode: 'Markdown' })
        break
    }
  }

  private async handleLessonCreation(ctx: Context, chatId: number, state: LessonCreationState) {
    const text = (ctx as any).message?.text || ''

    switch (state.step) {
      case 'title':
        state.title = text
        state.step = 'url'
        await ctx.reply('📝 Шаг 2 из 5\n\nВведите *URL* урока:', { parse_mode: 'Markdown' })
        break

      case 'url':
        state.url = text
        state.step = 'description'
        await ctx.reply('📝 Шаг 3 из 5\n\nВведите *описание* урока:', { parse_mode: 'Markdown' })
        break

      case 'description':
        state.description = text
        state.step = 'img'
        await ctx.reply('📝 Шаг 4 из 5\n\nОтправьте *ссылку на картинку* или "нет":', { parse_mode: 'Markdown' })
        break

      case 'img':
        state.img = text === 'нет' ? '' : text
        state.step = 'price'
        await ctx.reply('📝 Шаг 5 из 5\n\nВведите *цену* (только число):', { parse_mode: 'Markdown' })
        break

      case 'price':
        state.price = text
        const lesson = await this.lessonsService.createLesson({
          title: state.title,
          url: state.url || '',
          description: state.description || '',
          img: state.img || '',
          price: state.price ? parseFloat(state.price) : 0,
        } as any)
        this.lessonCreationStates.delete(chatId)
        await ctx.reply(`✅ Урок создан!\n\n📚 *${lesson.title}*`, { parse_mode: 'Markdown' })
        break
    }
  }

  // ===== СТАТЬИ (старые команды) =====

  @Command('notes')
  async getAllNotes(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await this.listNotes(ctx)
  }

  private async listNotes(ctx: Context) {
    const notes = await this.notesService.getAllNotes()

    if (notes.length === 0) {
      await ctx.reply('📭 Нет статей')
      return
    }

    for (const note of notes.slice(0, 10)) {
      const title = note.title
      const date = new Date(note.created_at).toLocaleDateString('ru-RU')
      const preview = note.text?.slice(0, 100) || ''

      await ctx.reply(`📝 *${title}*\n📅 ${date}\n\n${preview}...`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '👁 Посмотреть', callback_data: `view_note_${note.id}` },
              { text: '🗑 Удалить', callback_data: `delete_note_${note.id}` },
            ],
          ],
        },
      })
    }
  }

  @Action('list_notes')
  async actionListNotes(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    await this.listNotes(ctx)
  }

  @Action('add_note')
  async actionAddNote(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const chatId = (ctx as any).chat?.id
    if (chatId) {
      this.noteCreationStates.set(chatId, { step: 'title' })
      await ctx.reply('📝 Шаг 1 из 4\n\nВведите *название статьи*:', { parse_mode: 'Markdown' })
    }
  }

  @Action('list_comments')
  async actionListComments(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    await this.getComments(ctx)
  }

  @Action('list_orders')
  async actionListOrders(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const orders = await this.ordersService.getAllOrders()
    const text = orders.map(o => `#${o.id} | ${o.name} | ${o.total}₽ | ${o.status}`).join('\n')
    await ctx.reply(text || '📭 Нет заказов')
  }

  @Action(/view_note_(.+)/)
  async actionViewNote(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      const note = await this.notesService.getNoteById(id)
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
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const id = (ctx as any).match?.[1]
    if (!id) return

    try {
      await this.notesService.deleteNote(id)
      await ctx.reply('🗑 Статья удалена')
    } catch {
      await ctx.reply('❌ Ошибка удаления')
    }
  }

  @Action(/view_comments_(.+)/)
  async actionViewComments(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await ctx.answerCbQuery()
    const noteId = (ctx as any).match?.[1]
    if (!noteId) return

    try {
      const note = await this.notesService.getNoteById(noteId)
      const axios = require('axios')
      const apiUrl = process.env.API_URL || 'http://localhost:3001'
      const commentsRes = await axios.get(`${apiUrl}/api/comments/${noteId}`)
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

  @Command('comments')
  async getComments(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    const notes = await this.notesService.getAllNotes()

    if (notes.length === 0) {
      await ctx.reply('📭 Нет статей с комментариями')
      return
    }

    for (const note of notes.slice(0, 5)) {
      try {
        const axios = require('axios')
        const apiUrl = process.env.API_URL || 'http://localhost:3001'
        const commentsRes = await axios.get(`${apiUrl}/api/comments/${note.id}`)
        const comments = commentsRes.data

        await ctx.reply(`📝 *${note.title}*\n💬 Комментариев: ${comments.length}`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: `👁 Показать комментарии (${comments.length})`, callback_data: `view_comments_${note.id}` }],
            ],
          },
        })
      } catch {}
    }
  }

  @Command('orders')
  async getOrders(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    const orders = await this.ordersService.getAllOrders()
    const text = orders.map(o => `#${o.id} | ${o.name} | ${o.total}₽ | ${o.status}`).join('\n')
    await ctx.reply(text || '📭 Нет заказов')
  }

  @Command('products')
  async getProducts(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    await this.listProducts(ctx)
  }

  @Action(/order_shipped_(.+)/)
  async shipped(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    const id = (ctx as any).match?.[1]
    await ctx.answerCbQuery()
    await this.ordersService.updateOrder(id, { status: 'shipped' })
    await ctx.reply(`🚚 Заказ ${id} отправлен`)
  }

  @Action(/order_done_(.+)/)
  async done(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    const id = (ctx as any).match?.[1]
    await ctx.answerCbQuery()
    await this.ordersService.updateOrder(id, { status: 'done' })
    await ctx.reply(`✅ Заказ ${id} выполнен`)
  }

  @Action(/order_cancel_(.+)/)
  async cancel(@Ctx() ctx: Context) {
    if (!(await this.checkAdmin(ctx))) return
    const id = (ctx as any).match?.[1]
    await ctx.answerCbQuery()
    await this.ordersService.updateOrder(id, { status: 'canceled' })
    await ctx.reply(`❌ Заказ ${id} отменён`)
  }
}
