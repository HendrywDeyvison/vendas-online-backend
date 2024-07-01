import { CartProductEntity } from '../../cart-product/entities/cart-product.entity';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'active', nullable: false })
  active: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.cart)
  cartProduct?: CartProductEntity[];
}
