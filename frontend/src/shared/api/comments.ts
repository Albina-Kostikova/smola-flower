import type { Comment, CreateCommentDto } from '@/entities/comment'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getCommentsByNoteId(noteId: string): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/notes/${noteId}/comments`)
  if (!res.ok) {
    throw new Error(`Failed to fetch comments: ${res.statusText}`)
  }
  return res.json()
}

export async function createComment(
  noteId: string,
  commentData: CreateCommentDto,
): Promise<Comment> {
  const res = await fetch(`${API_URL}/notes/${noteId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  })

  if (!res.ok) {
    throw new Error(`Failed to create comment: ${res.statusText}`)
  }

  return res.json()
}