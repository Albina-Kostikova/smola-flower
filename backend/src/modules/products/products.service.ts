import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './products.entity'
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  create() {
    const product = this.productRepository.create({
      img: 'https://example.com/image.jpg',
      title: 'Example Product',
      price: 19.99,
      technic: 'Example Technic',
      diameter: 'Example Diameter',
      color: 'Example Color',
      form: 'Example Form',
      material: 'Example Material',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.productRepository.save(product);
  }
  getAll() {
    return this.productRepository.find();
  }
  getById(id: string) {
    return this.productRepository.findOneBy({ id });
  }
  update(id: string, updateData: Partial<Product>) {
    return this.productRepository.update(id, updateData);
  }
  delete(id: string) {    return this.productRepository.delete(id);
  }
}