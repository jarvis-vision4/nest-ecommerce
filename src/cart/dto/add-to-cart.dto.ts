import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AddToCartDTO {
  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  variantItemIds!: number[];

  @IsNumber()
  @IsNotEmpty()
  productId!: number;
}
