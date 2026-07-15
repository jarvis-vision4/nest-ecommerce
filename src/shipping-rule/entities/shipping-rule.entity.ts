import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type SHIPPING_RULE_TYPES = 'very fast' | 'fast' | 'normal'

@Entity()
export class ShippingRule {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ type: 'varchar', length: 12 })
    type!: SHIPPING_RULE_TYPES;
    @Column({ type: 'decimal', precision: 3, scale: 2 })
    cost!: number;
    @Column({ type: 'int' })
    estimateDay!: number;
    @Column({ default: true })
    status!: boolean;
}
