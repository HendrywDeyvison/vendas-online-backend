import { ReturnProductDTO } from './../../product/dtos/return-product.dto';
import { CategoryEntity } from '../entities/category.entity';

export class ReturnCategoryDto {
  id: number;
  name: string;
  active: boolean;
  amountProducts?: number;
  products?: ReturnProductDTO[];

  constructor(categoryEntity: CategoryEntity, amountProducts: number = 0) {
    this.id = categoryEntity.id;
    this.name = categoryEntity.name;
    this.active = categoryEntity.active;
    this.amountProducts = amountProducts;
    this.products =
      categoryEntity.products &&
      categoryEntity.products.map((product) => new ReturnProductDTO(product));
  }
}
