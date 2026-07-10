import { Expose, Transform, Type } from "class-transformer";
import { Product } from "../entities/product.entity";
import { Variant } from "src/variants/entities/variant.entity";
import { ResponseVariantDto } from "src/variants/dto/response-variant.dto";

export class ResponseProductDto {
    @Expose()
    id!: number;
    @Expose()
    name!: string;
    @Expose()
    price!: number;
    @Expose()
    offerPrice!: number;
    @Expose()
    shortDescription!: string;
    @Expose()
    longDescription!: string;
    @Expose()
    categoryId!: number;
    @Expose()
    @Transform(({ obj }: { obj: Product }) => obj.category.name)
    category!: string;
    @Expose()
    slug!: string;
    @Expose()
    quantity!: number;
    @Expose()
    @Type(() => ResponseVariantDto)
    variants!: ResponseVariantDto[]
}