import { ReturnProductDTO } from './../../product/dtos/return-product.dto';
import { ReturnOrderDTO } from './../../order/dtos/return-order.dto';
import { OrderProductEntity } from '../entities/order-product.entity';

export class ReturnOrderProductDto {
  id: number;
  orderId: number;
  productId: number;
  amount: number;
  price: number;
  order?: ReturnOrderDTO;
  product?: ReturnProductDTO;

  constructor(orderProduct: OrderProductEntity) {
    this.id = orderProduct.id;
    this.orderId = orderProduct.orderId;
    this.productId = orderProduct.productId;
    this.amount = orderProduct.amount;
    this.price = orderProduct.price;
    this.order = orderProduct.order && new ReturnOrderDTO(orderProduct.order);
    this.product = orderProduct.product && new ReturnProductDTO(orderProduct.product);
  }
}
