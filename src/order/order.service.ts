import { OrderProductEntity } from './../order-product/entities/order-product.entity';
import { ProductEntity } from './../product/entities/product.entity';
import { CartEntity } from './../cart/entities/cart.entity';
import { ProductService } from './../product/product.service';
import { OrderProductService } from './../order-product/order-product.service';
import { CartService } from './../cart/cart.service';
import { PaymentService } from './../payment/payment.service';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly productService: ProductService,
  ) {}

  async saveOrder(
    createOrderDTO: CreateOrderDTO,
    userId: number,
    payment: PaymentEntity,
  ): Promise<OrderEntity> {
    return this.orderRepository.save({
      userId,
      addressId: createOrderDTO.addressId,
      date: new Date(),
      paymentId: payment.id,
    });
  }

  async createOrderProductUsingCart(
    cart: CartEntity,
    order: OrderEntity,
    products: ProductEntity[],
  ): Promise<OrderProductEntity[] | void[]> {
    return await Promise.all(
      cart.cartProduct?.map((cartProduct) => {
        this.orderProductService.createOrderProduct({
          orderId: order?.id,
          productId: cartProduct.productId,
          price: products.find((product) => product.id == cartProduct.productId)?.price || 0,
          amount: cartProduct.amount,
        });
      }),
    );
  }

  async createOrder(createOrderDTO: CreateOrderDTO, userId: number): Promise<OrderEntity> {
    const cart = await this.cartService.findCartByUserId(userId, true);

    const products = await this.productService.findAllProducts(
      cart.cartProduct?.map((cartProduct) => cartProduct.productId),
    );

    const payment: PaymentEntity = await this.paymentService.createPayment(
      createOrderDTO,
      products,
      cart,
    );

    const order = await this.saveOrder(createOrderDTO, userId, payment);

    await this.createOrderProductUsingCart(cart, order, products);

    await this.cartService.clearCart(userId);

    return order;
  }

  async findOrdersByUserId(userId: number): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: {
        address: true,
        ordersProduct: {
          product: true,
        },
        payment: {
          paymentStatus: true,
        },
      },
    });

    if (!orders?.length) {
      throw new NotFoundException('no order found');
    }

    return orders;
  }
}
