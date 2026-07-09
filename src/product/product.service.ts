import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
     @InjectRepository(Product)
        private productRepository:Repository<Product>,
      private categroyService:CategoryService
  ){

  }
 async create(createProductDto: CreateProductDto) {
    const category=await this.categroyService.findOne(
      createProductDto.categoryId
    )
    const product=new Product()
    product.category=category
    Object.assign(product,createProductDto)
    return this.productRepository.save(product)
  }

  async findAll() {
    const products=await this.productRepository.find({
      relations:{
        category:true
      }
    })
    return products
  }

  async findOne(id: number) {
    const product=await this.productRepository.findOne({
      where:{
        id
      },
      relations:{
        category:true
      }
    })
    if (!product) {
      throw new NotFoundException("Product with Id not found")
    }
    return product;
  }

  async findOneBySlug(slug:string){
    const product=await this.productRepository.findOne({
      where:{
        slug
      },
      relations:{
        category:true
      }
    })
    if (!product) {
      throw new NotFoundException("Product with Id not found")
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product=await this.findOne(id)
    if (updateProductDto.categoryId) {
     product.category=await this.categroyService.findOne(updateProductDto.categoryId)
    }
    Object.assign(product,updateProductDto)
    return this.productRepository.save(product)
  }

  async remove(id: number) {
    const product=await this.findOne(id)
    this.productRepository.softRemove(product)
  }
}
