import { ReturnOrderProductDto } from './../../order-product/dtos/return-order-product.dto';
import { ReturnPaymentDto } from '../../payment/dtos/return-payment.dto';
import { ReturnAddressDto } from './../../address/dtos/returnAddress.dto';
import { ReturnUserDto } from './../../user/dtos/returnUser.dto';
import { OrderEntity } from './../entities/order.entity';

export class ReturnOrderDTO {
  id: number;
  date: Date;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDto;
  ordersProduct?: ReturnOrderProductDto[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date;
    this.user = order.user && new ReturnUserDto(order.user);
    this.address = order.address && new ReturnAddressDto(order.address);
    this.payment = order.payment && new ReturnPaymentDto(order.payment);
    this.ordersProduct =
      order.ordersProduct &&
      order.ordersProduct.map((orderProduct) => new ReturnOrderProductDto(orderProduct));
  }
}
