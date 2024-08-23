import { ProductEntity } from '../../product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'created_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.category)
  products?: ProductEntity[];

  @Column({ name: 'active', nullable: false })
  active: boolean;
}
