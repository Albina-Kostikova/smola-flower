import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  address: string

  @Column()
  delivery: string

  @Column()
  payment: string

  // товары храним как JSON (для MVP это нормально)
  @Column('json')
  products: {
    productId: string
    quantity: number
  }[]

  @Column('decimal', { precision: 10, scale: 2 })
  total: number

  @Column({ default: 'new' })
  status: 'new' | 'processing' | 'shipped' | 'done' | 'canceled'

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}