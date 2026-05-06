export interface Comment {
  id: string
  note_id: string
  name: string
  avatar_seed: string
  text: string
  is_owner: boolean
  created_at: Date
}