import { IsJSON, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class AddToCartDTO {
    @IsNumber()
    @IsNotEmpty()
    quantity!: number;
    variantItemIds!: [number];
    @IsNumber()
    @IsNotEmpty()
    productId!: number;

}
