import { ReturnUserDto } from './../../user/dtos/returnUser.dto';
import { OrderEntity } from './../entities/order.entity';

export class ReturnOrderDTO {
  id: number;
  date: Date;
  user?: ReturnUserDto;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date;
    this.user = order.user && new ReturnUserDto(order.user);
  }
}
