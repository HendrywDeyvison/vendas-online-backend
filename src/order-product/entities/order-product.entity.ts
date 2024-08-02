import { ProductEntity } from './../../product/entities/product.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_product' })
export class OrderProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'order_id', nullable: false })
  orderId: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @Column({ name: 'amount', nullable: false })
  amount: number;

  @Column({ name: 'price', nullable: false })
  price: number;

  @Column({ name: 'created_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.ordersProduct)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order?: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.ordersProduct)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;
}
