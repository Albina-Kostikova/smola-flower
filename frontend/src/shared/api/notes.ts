import type { Note } from '@/entities/note'
const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001'
export async function getAllNotes(): Promise<Note[]> {

  const res = await fetch(`${API_URL}/api/notes`)
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`)
  }
  return res.json()
}
export async function getNoteById(id: string): Promise<Note> {

  const res = await fetch(`${API_URL}/api/notes/${id}`)
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Note with id ${id} not found`)
    }
    throw new Error(`Failed to fetch notes: ${res.statusText}`)
  }
  return res.json()
}