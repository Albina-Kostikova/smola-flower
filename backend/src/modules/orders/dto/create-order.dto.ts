import {
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'

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
  @IsOptional()
  address?: string
}

class CartItemDto {
  @IsString()
  @IsNotEmpty()
  id!: string

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

class SingleItemDto {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsString()
  @IsNotEmpty()
  title!: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @Min(0)
  price!: number
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CustomerDto)
  customer!: CustomerDto

  @IsString()
  @IsOptional()
  delivery?: string

  @IsString()
  @IsOptional()
  payment?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @IsOptional()
  items?: CartItemDto[]

  @ValidateNested()
  @Type(() => SingleItemDto)
  @IsOptional()
  item?: SingleItemDto

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number
}