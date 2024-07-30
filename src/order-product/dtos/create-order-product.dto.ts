import { IsNumber } from 'class-validator';

export class CreateOrderProductDTO {
  @IsNumber()
  productId?: number;

  @IsNumber()
  orderId?: number;

  @IsNumber()
  price?: number;

  @IsNumber()
  amount?: number;
}
