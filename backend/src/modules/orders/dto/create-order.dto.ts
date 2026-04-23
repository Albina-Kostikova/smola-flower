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
  productId: string

  @IsNumber()
  @Min(1)
  quantity: number
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(5)
  phone: string

  @IsString()
  @MinLength(5)
  address: string

  @IsEnum(DeliveryMethod)
  delivery: DeliveryMethod

  @IsEnum(PaymentMethod)
  payment: PaymentMethod

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[]
}