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
    this.width = 16;
    this.height = 25;
    this.length = 11;
    this.weight = 0.3;
    this.insurance_value = product.price;
    this.quantity = amount;
  }
}
