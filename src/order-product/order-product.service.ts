import { CreateOrderProductDTO } from './dtos/create-order-product.dto';
import { OrderProductEntity } from './entities/order-product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
  ) {}

  async createOrderProduct(
    createOrderProductDTO: CreateOrderProductDTO,
  ): Promise<OrderProductEntity> {
    return this.orderProductRepository.save(createOrderProductDTO);
  }
}
