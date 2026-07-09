import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { TransformDto } from 'src/cores/interceptors/transform-dto.interceptor';
import { ResponseVariantDto } from './dto/response-variant.dto';

@Controller('api/v1/variants')
@TransformDto(ResponseVariantDto)
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) { }

  @Post()
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto);
  }

  @Get(':id')
  findVariant(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.findVariant(id);
  }

  @Get(':productId/product')
  findOne(@Param('productId', ParseIntPipe) id: number) {
    return this.variantsService.findProductIdWithVariants(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantsService.update(+id, updateVariantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantsService.remove(+id);
  }
}
