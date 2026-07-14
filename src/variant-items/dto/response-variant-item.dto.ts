import { Expose, Transform } from 'class-transformer';
import { Variant } from 'src/variants/entities/variant.entity';

export class ResponseVariantItemDto {
  @Expose()
  id!: number;
  @Expose()
  value!: string;
  @Expose()
  variantId!: number;
  @Expose()
  price!: number;
  @Expose()
  @Transform(({ obj }) => obj.variant?.name)
  item!: string;
}
