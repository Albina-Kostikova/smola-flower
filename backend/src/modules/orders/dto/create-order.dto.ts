import {
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator'

import { Type } from 'class-transformer'

export enum DeliveryMethod {
  POST_RUSSIA = 'post_russia',
  CDEK = 'cdek',
  PICKUP = 'pickup',
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
}

class OrderProductDto {
  @IsString()
  @IsNotEmpty()
  productId!: string

  @IsNumber()
  @Min(1)
  quantity!: number
}

class CartItemDto {
  @IsNumber()
  @Min(1)
  id!: number

  @IsString()
  @IsNotEmpty()
  title!: string

  @IsNumber()
  @Min(0)
  price!: number

  @IsNumber()
  @Min(1)
  quantity!: number
}

class CustomerDto {
  @IsString()
  @MinLength(2)
  fio!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(5)
  phone!: string

  @IsString()
  @MinLength(5)
  address!: string
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @MinLength(5)
  @IsOptional()
  phone?: string

  @IsString()
  @MinLength(5)
  @IsOptional()
  address?: string

  @IsString()
  @IsOptional()
  delivery?: string

  @IsString()
  @IsOptional()
  payment?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  @IsOptional()
  products?: OrderProductDto[]

  // Поля для нового формата с фронтенда
  @ValidateNested()
  @Type(() => CustomerDto)
  @IsOptional()
  customer?: CustomerDto

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @IsOptional()
  items?: CartItemDto[]

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number
}
