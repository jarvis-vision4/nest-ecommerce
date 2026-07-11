import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User;

    @Column({ default: 0 })
    totalPrice!: number;



    @OneToMany(() => CartItem, (c) => c.cart)
    cartItems!: CartItem[]

}
