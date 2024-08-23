import { ReturnProductDTO } from './../../product/dtos/return-product.dto';

export class SizeProduct {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;

  constructor(product: ReturnProductDTO, amount: number) {
    this.id = String(product.id);
    this.width = product.width;
    this.height = product.height;
    this.length = product.length;
    this.weight = product.weight;
    this.insurance_value = product.price;
    this.quantity = amount;
  }
}
