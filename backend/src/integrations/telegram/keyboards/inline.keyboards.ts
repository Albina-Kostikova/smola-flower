export const orderKeyboard = (id: string) => ({
  inline_keyboard: [
    [
      { text: '🚚 Shipped', callback_data: `order_shipped_${id}` },
      { text: '✅ Done', callback_data: `order_done_${id}` },
    ],
    [
      { text: '❌ Cancel', callback_data: `order_cancel_${id}` },
    ],
  ],
})