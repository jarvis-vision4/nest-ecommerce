import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VariantItemsService } from './variant-items.service';
import { CreateVariantItemDto } from './dto/create-variant-item.dto';
import { UpdateVariantItemDto } from './dto/update-variant-item.dto';
import { TransformDto } from 'src/cores/interceptors/transform-dto.interceptor';
import { ResponseVariantItemDto } from './dto/response-variant-item.dto';

@Controller('api/v1/variant-items')
@TransformDto(ResponseVariantItemDto)
export class VariantItemsController {
  constructor(private readonly variantItemsService: VariantItemsService) {}

  @Post()
  create(@Body() createVariantItemDto: CreateVariantItemDto) {
    return this.variantItemsService.create(createVariantItemDto);
  }

  @Get()
  findAll() {
    return this.variantItemsService.findAll();
  }
  @Get(':id')
  findVariantItemById(@Param('id', ParseIntPipe) id: number) {
    return this.variantItemsService.findVariantItemById(id);
  }

  @Post('restore')
  restoreAll() {
    return this.variantItemsService.restore();
  }

  @Get(':variantId/variant')
  findVariantItems(@Param('variantId', ParseIntPipe) id: number) {
    return this.variantItemsService.findVariantItemsByVariantId(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariantItemDto: UpdateVariantItemDto,
  ) {
    return this.variantItemsService.update(id, updateVariantItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantItemsService.remove(+id);
  }
}
