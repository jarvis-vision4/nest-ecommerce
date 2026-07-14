import { IsInt, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { AddToCartDTO } from './add-to-cart.dto';

export class UpdateCartDTO extends PartialType(AddToCartDTO) {
  @IsInt()
  @Min(0)
  quantity!: number;
}
