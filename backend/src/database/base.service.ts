import { Injectable } from '@nestjs/common'
import { SupabaseService } from './supabase.service'
import { NotFoundException } from '@nestjs/common'

@Injectable()
export abstract class BaseService<T extends { id: string }> {
  constructor(
    protected supabaseService: SupabaseService,
    protected tableName: string,
  ) {}

  async getAll(orderField: string = 'created_at'): Promise<T[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .order(orderField, { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`)
    }

    return (data || []) as T[]
  }

  async getById(id: string): Promise<T> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw new NotFoundException(`${this.tableName} with id ${id} not found`)
    }

    return data as T
  }

  async create(createData: Partial<T>): Promise<T> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .insert([createData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`)
    }

    return data as T
  }

  async update(id: string, updateData: Partial<T>): Promise<T> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`)
    }

    return data as T
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`)
    }
  }
}