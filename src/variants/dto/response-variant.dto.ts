import { Expose, Type } from "class-transformer";
import { ResponseVariantItemDto } from "src/variant-items/dto/response-variant-item.dto";

export class ResponseVariantDto {
    @Expose()
    id!: number;
    @Expose()
    name!: string;
    @Expose()
    @Type(() => ResponseVariantItemDto)
    items!: ResponseVariantItemDto[]

}