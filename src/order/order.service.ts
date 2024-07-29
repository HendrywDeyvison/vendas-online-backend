import { PaymentService } from './../payment/payment.service';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderEntity: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrder(createOrderDTO: CreateOrderDTO, cartId: number) {
    const payment: PaymentEntity = await this.paymentService.createPayment(createOrderDTO);

    return { payment, cartId };
  }
}
