import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!:number;
    
    name!:string;
    price!:number;
    offerPrice!:number;
    shortDescription!:string;
    longDescription!:string;
}
