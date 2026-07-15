import { Expose, Transform } from "class-transformer";
import { Product } from "src/product/entities/product.entity";

export class ResponseReviewDto {
    @Expose()
    id!: number;
    @Expose()
    content!: string;
    @Expose()
    rating!: number;
    @Expose()
    @Transform(({ obj }: { obj: Product }) => obj.name)
    product!: string;
    @Expose()
    productId!: number;
}