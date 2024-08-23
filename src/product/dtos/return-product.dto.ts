import { ReturnCategoryDto } from './../../category/dtos/return-category.dto';
import { ProductEntity } from './../entities/product.entity';
export class ReturnProductDTO {
  id: number;
  name: string;
  price: number;
  image: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  diameter: number;
  category?: ReturnCategoryDto;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
    this.width = productEntity.width;
    this.height = productEntity.height;
    this.length = productEntity.length;
    this.weight = productEntity.weight;
    this.diameter = productEntity.diameter;
    this.category = productEntity.category && new ReturnCategoryDto(productEntity.category);
  }
}
