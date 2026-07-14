import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private variantService: VariantsService,
  ) {}
  async create(createVariantItemDto: CreateVariantItemDto) {
    const variant = await this.variantService.findVariant(
      createVariantItemDto.variantId,
    );
    const variantItem = new VariantItem();
    variantItem.variant = variant;
    Object.assign(variantItem, createVariantItemDto);
    return this.variantRepository.save(variantItem);
  }

  findAll() {
    return `This action returns all variantItems`;
  }

  async findVariantItemsByVariantId(id: number) {
    const variant = await this.variantService.findVariant(id);
    const variantItems = await this.variantRepository.find({
      where: {
        variant,
      },
    });
    if (variantItems.length == 0) {
      throw new NotFoundException('Variant Items Not Found');
    }
    return variantItems;
  }
  async findVariantItemById(id: number) {
    const variantItem = await this.variantRepository.findOne({
      where: {
        id,
      },
      relations: {
        variant: true,
      },
    });
    console.log(variantItem);
    if (!variantItem) {
      throw new BadRequestException('Variant Item not found');
    }
    return variantItem;
  }
  async update(id: number, updateVariantItemDto: UpdateVariantItemDto) {
    const variantItem = await this.findVariantItemById(id);

    Object.assign(variantItem, updateVariantItemDto);

    return this.variantRepository.save(variantItem);
  }

  async remove(id: number) {
    const variantItem = await this.findVariantItemById(id);
    return this.variantRepository.softRemove(variantItem);
  }
  async restore() {
    const variantItems = await this.variantRepository.find({
      withDeleted: true,
    });
    if (!variantItems) {
      throw new NotFoundException('Variant Items not found');
    }
    await this.variantRepository.recover(variantItems);
  }
}
