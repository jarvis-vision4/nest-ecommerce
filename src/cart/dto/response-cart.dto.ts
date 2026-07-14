import { Expose, Transform, Type } from 'class-transformer';

interface CartItem {
  product: { id: number; name: string; price: number; image: string };
  variant: string;
}

export class CartItemResponseDto {
  @Expose()
  id!: number;

  @Expose()
  quantity!: number;

  @Expose()
  price!: number;

  @Expose()
  @Transform(({ obj }: { obj: CartItem }) => obj.product)
  product!: {
    id: number;
    name: string;
    price: number;
    image: string;
  };

  @Expose()
  @Transform(({ obj }: { obj: CartItem }) => {
    try {
      const parsed = JSON.parse(obj.variant) as {
        variants: Array<{
          variantId: number;
          variantName: string;
          variantItemId: number;
          value: string;
          price: number;
        }>;
      };
      return parsed.variants || [];
    } catch {
      return [];
    }
  })
  variants!: Array<{
    variantId: number;
    variantName: string;
    variantItemId: number;
    value: string;
    price: number;
  }>;
}

export class ResponseCartDto {
  @Expose()
  id!: number;

  @Expose()
  totalPrice!: number;

  @Expose()
  @Type(() => CartItemResponseDto)
  cartItems!: CartItemResponseDto[];
}
