import { OrderProductService } from './../order-product/order-product.service';
import { CartService } from './../cart/cart.service';
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
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
  ) {}

  async createOrder(createOrderDTO: CreateOrderDTO, cartId: number, userId: number) {
    const payment: PaymentEntity = await this.paymentService.createPayment(createOrderDTO);

    const order = await this.orderRepository.save({
      userId,
      addressId: createOrderDTO.addressId,
      date: new Date(),
      paymentId: payment.id,
    });

    const cart = await this.cartService.findCartByUserId(userId, true);

    cart.cartProduct?.forEach((cartProduct) => {
      this.orderProductService.createOrderProduct({
        orderId: order.id,
        productId: cartProduct.productId,
        price: 0,
        amount: cartProduct.amount,
      });
    });

    return { cartId, cart, payment, order };
  }
}