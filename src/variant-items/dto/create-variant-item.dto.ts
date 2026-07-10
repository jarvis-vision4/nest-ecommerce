import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVariantItemDto {
    @IsNotEmpty()
    @IsString()
    value!: string;
    @IsNotEmpty()
    @IsNumber()
    variantId!: number;
    @Optional()
    price!: number;
}
