import { Product } from "src/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ type: 'decimal', precision: 4, scale: 2 })
    price!: number;
    @Column({ type: 'int' })
    quantity!: number;
    @ManyToOne(() => Product)
    products!: Product[];
    @Column({ type: 'text' })
    variant!: string;
    @ManyToOne(() => Cart, (c) => c.cartItems)
    cart!: Cart
}
