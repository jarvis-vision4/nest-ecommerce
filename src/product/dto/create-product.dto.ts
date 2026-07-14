import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  name!: string;
  @IsNotEmpty()
  @IsNumber()
  price!: number;
  @IsNumber()
  @IsOptional()
  offerPrice!: number;
  @IsString()
  @IsNotEmpty()
  @Length(0, 255)
  shortDescription!: string;
  @IsString()
  @IsNotEmpty()
  longDescription!: string;
  @IsNotEmpty()
  @IsInt()
  categoryId!: number;
  @IsNotEmpty()
  @IsInt()
  quantity!: number;
}
