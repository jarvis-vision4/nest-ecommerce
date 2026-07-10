import { Injectable } from '@nestjs/common';
import { CreateVariantItemDto } from './dto/create-variant-item.dto';
import { UpdateVariantItemDto } from './dto/update-variant-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VariantItem } from './entities/variant-item.entity';
import { Repository } from 'typeorm';
import { VariantsService } from 'src/variants/variants.service';

@Injectable()
export class VariantItemsService {
  constructor(
    @InjectRepository(VariantItem)
    private variantRepository: Repository<VariantItem>,
    private variantService: VariantsService
  ) {

  }
  create(createVariantItemDto: CreateVariantItemDto) {
    return 'This action adds a new variantItem';
  }

  findAll() {
    return `This action returns all variantItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variantItem`;
  }

  update(id: number, updateVariantItemDto: UpdateVariantItemDto) {
    return `This action updates a #${id} variantItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} variantItem`;
  }
}
