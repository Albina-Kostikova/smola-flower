'use client'

import { useState, useEffect } from 'react'
import type { Comment } from '@/entities/comment'
import { getCommentsByNoteId, createComment } from '@/shared/api/comments'
import { PinkButton } from '@/shared/ui/Buttons'

interface CommentsSectionProps {
  noteId: string | null
}

const AVATARS = ['alex.jpg', 'maria.jpg', 'john.jpg', 'sofia.jpg', 'leona.jpg', 'anna.jpg', 'maxima.jpg', 'kate.jpg']

export function CommentsSection({ noteId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newName, setNewName] = useState('')
  const [newText, setNewText] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('alex.jpg')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (noteId) {
      loadComments(noteId)
    }
  }, [noteId])

  const loadComments = async (id: string) => {
    try {
      const data = await getCommentsByNoteId(id)
      setComments(data)
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }
  }

  const addComment = async () => {
    if (!newName.trim() || !newText.trim()) {
      setError('Пожалуйста, заполните имя и текст комментария')
      return
    }
    setError('')

    if (!noteId) return

    const name = newName.trim()
    const text = newText.trim()
    const avatar = selectedAvatar

    setNewText('')
    setIsSending(true)
    setSuccessMessage('Ваш комментарий отправляется…')

    try {
      const newComment = await createComment(noteId, {
        name,
        avatar_seed: avatar,
        text,
        is_owner: false,
      })

      setComments(prev => [...prev, newComment])
      setSuccessMessage('Комментарий опубликован!')

      setTimeout(() => setSuccessMessage(''), 10000)
    } catch (err) {
      console.error('Failed to add comment:', err)
      setError('Ошибка отправки комментария')
      setSuccessMessage('')

      setNewText(text)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addComment()
    }
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg flex flex-col items-center lg:ml-3">
      <div className="bg-(--color-accent) rounded-2xl w-full text-grey pt-5 space-y-4 p-7">
        <h4 className="text-lg font-semibold text-gray-800">Оставьте комментарий</h4>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Выберите аватар</label>
          <div className="flex gap-2 flex-wrap">
            {AVATARS.map(seed => (
              <button
                key={seed}
                onClick={() => setSelectedAvatar(seed)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                  selectedAvatar === seed
                    ? 'border-(--color-primary) scale-110 shadow-md'
                    : 'border-white hover:border-(--color-secondary)'
                }`}>
                <img src={`/images/${seed}`} alt={`Аватар ${seed}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Ваше имя</label>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Имя"
            className="w-full px-4 py-2.5 bg-white border border-gray-400 rounded-4xl focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:text-(--color-primary) focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Текст комментария</label>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите ваш комментарий..."
            rows={3}
            className="w-full px-4 py-2.5 bg-white border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all resize-none focus:text-(--color-primary)"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm font-medium">{successMessage}</p>}
        <div className="flex justify-center">
          <PinkButton
            onClick={addComment}
            disabled={isSending}
            text={isSending ? 'Отправка…' : 'Отправить комментарий'}
            className={`py-3 self-center border-none bg-(--color-primary) text-white font-semibold rounded-2xl transition-all duration-200 active:scale-95 ${isSending ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          />
        </div>
      </div>
      <h4 className="w-full border-b mt-5 pl-1 border-gray-600">Комментариев: {comments.length}</h4>
      <div className="flex-1 max-h-125 overflow-y-auto space-y-4 p-5 mb-6 pr-2 scrollbar-thin">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className={`flex gap-3 items-start ${comment.is_owner ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 ${
                  comment.is_owner ? 'border-(--color-primary)' : 'border-gray-200'
                }`}>
                <img
                  src={`/images/${comment.avatar_seed || 'alex.jpg'}`}
                  onError={e => {
                    e.currentTarget.src = '/images/alex.jpg'
                  }}
                  alt={comment.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className={`max-w-[70%] ${comment.is_owner ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 ${comment.is_owner ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-semibold text-gray-800">
                    {comment.is_owner ? `${comment.name} 👑` : comment.name}
                  </span>
                  <span className="text-xs text-gray-100">{formatTime(comment.created_at)}</span>
                </div>
                <div
                  className={`inline-block px-4 py-2.5 text-sm leading-relaxed ${
                    comment.is_owner
                      ? 'bg-(--color-primary) text-white rounded-2xl rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                  }`}>
                  {comment.text}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">Пока нет комментариев. Будьте первым!</p>
        )}
      </div>
    </section>
  )
}
