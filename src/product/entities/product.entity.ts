import slugify from 'slugify';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Category } from 'src/category/entities/category.entity';
import { ProductGallery } from 'src/product-galleries/entities/product-gallery.entity';
import { Variant } from 'src/variants/entities/variant.entity';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 100 })
  name!: string;
  @Column({ type: 'numeric', precision: 6, scale: 2, default: 0 })
  price!: number;
  @Column({ type: 'varchar', length: 100, nullable: true })
  image!: string;
  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  offerPrice!: number;
  @Column({ type: 'varchar', length: 255 })
  shortDescription!: string;
  @Column({ type: 'text', nullable: true })
  longDescription!: string;
  @ManyToOne(() => Category, (c) => c.products)
  category!: Category;
  @Column({ type: 'int' })
  quantity!: number;
  @DeleteDateColumn()
  deletedDate!: Date;
  @OneToMany(() => ProductGallery, (g) => g.product)
  productGalleries!: ProductGallery[];
  @OneToMany(() => Variant, (v) => v.product)
  variants!: Variant[];
  @Column({ type: 'text' })
  slug!: string;
  @BeforeInsert()
  @AfterUpdate()
  generateSlug() {
    const date = new Date();
    this.slug = `${slugify(this.name)}-${date.getTime()}`;
  }
}
