import { Expose, Transform } from "class-transformer";
import { Product } from "../entities/product.entity";

export class ResponseProductDto{
            @Expose()
            name!:string;
             @Expose()
            price!:number;
            @Expose()
            offerPrice!:number;
             @Expose()
            shortDescription!:string;
             @Expose()
            longDescription!:string;
             @Expose()
            categoryId!:number;
            @Expose()
            @Transform(({obj}:{obj:Product})=>obj.category.name)
            category!:string;
            @Expose()
            slug!:string;
            @Expose()
            quantity!:number;
}