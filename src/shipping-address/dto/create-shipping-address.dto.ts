import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateShippingAddressDto {
    @IsString()
    @IsNotEmpty()
    value!: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(12)
    phoneNumber!: string;
}
