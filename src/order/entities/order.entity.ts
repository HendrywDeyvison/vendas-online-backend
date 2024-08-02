import { OrderProductEntity } from './../../order-product/entities/order-product.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { AddressEntity } from './../../address/entities/address.entity';
import { UserEntity } from './../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'address_id', nullable: false })
  addressId: number;

  @Column({ name: 'date', nullable: false })
  date: Date;

  @Column({ name: 'payment_id', nullable: false })
  paymentId: number;

  @Column({ name: 'created_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => AddressEntity, (address) => address.orders)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address?: AddressEntity;

  @ManyToOne(() => PaymentEntity, (payment) => payment.orders)
  @JoinColumn({ name: 'payment_id', referencedColumnName: 'id' })
  payment?: PaymentEntity;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order)
  ordersProduct?: OrderProductEntity[];
}
