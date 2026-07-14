import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShippingRule {
    @PrimaryGeneratedColumn()
    id!: number;
}
