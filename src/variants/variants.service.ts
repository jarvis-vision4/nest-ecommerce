import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class VariantsService {

  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    private productService: ProductService
  ) {

  }
  async findVariant(id: number) {
    const variant = await this.variantRepository.findOne({
      where: {
        id
      }
    })
    if (!variant) {
      throw new NotFoundException("Variant Not Found")
    }
    return variant
  }
  async create(createVariantDto: CreateVariantDto) {
    const product = await this.productService.findOne(createVariantDto.productId)

    const variant = new Variant()
    variant.product = product
    Object.assign(variant, { ...createVariantDto, name: createVariantDto.name.toLowerCase() })
    return this.variantRepository.save(variant)
  }


  async findVariantsWithProductId(id: number) {
    const product = await this.productService.findOne(id)
    const variants = await this.variantRepository.find({
      where: {
        product
      }
    })
    if (variants.length == 0) {
      throw new NotFoundException("Variants Not found")
    }
    return variants;
  }

  async update(id: number, updateVariantDto: UpdateVariantDto) {
    return `This action updates a #${id} variant`;
  }

  async remove(id: number) {
    const variant = await this.findVariant(id)
    this.variantRepository.remove(variant)
  }
}
