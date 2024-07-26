import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderEntity: Repository<OrderEntity>,
  ) {}

  async createOrder(createOrder: CreateOrderDTO, cartId: number) {
    return { ...createOrder, cartId };
  }
}
