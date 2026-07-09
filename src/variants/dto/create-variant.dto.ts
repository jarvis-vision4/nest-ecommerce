import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateVariantDto {
    @IsNotEmpty()
    @IsString()
    name!: string;
    @IsNotEmpty()
    @IsNumber()
    productId!: number;
}
