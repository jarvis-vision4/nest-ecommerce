import { UserPayload } from 'src';
import { Review } from 'src/review/entities/review.entity';
import { Role } from 'src/role/entities/role.entity';
import { ShippingAddress } from 'src/shipping-address/entities/shipping-address.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;

  @OneToMany(() => ShippingAddress, (s) => s.user)
  shippingAddresses!: ShippingAddress[]

  @OneToMany(() => Review, (r) => r.user)
  reviews!: Review[]
}
