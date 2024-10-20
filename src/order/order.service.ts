import { ReturnOrderDTO } from './dtos/return-order.dto';
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
import { PaginationDto, PaginationMeta } from 'src/dtos/pagination.dto';

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

  DEFAULT_PAGE_SIZE = 10;
  FIRST_PAGE = 1;

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

  async findAllOrders(
    size: number = this.DEFAULT_PAGE_SIZE,
    page: number = this.FIRST_PAGE,
  ): Promise<PaginationDto<ReturnOrderDTO[]>> {
    page = Number(page) ? page : this.FIRST_PAGE;
    const take = Number(size) ? size : this.DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * size;

    const [orders, total] = await this.orderRepository.findAndCount({
      order: {
        id: 'ASC' as const,
      },
      take,
      skip,
      relations: {
        user: true,
        ordersProduct: {
          product: {
            category: true,
          },
        },
      },
    });

    if (!orders?.length) {
      throw new NotFoundException('Orders not found');
    }

    return new PaginationDto(
      new PaginationMeta(size, total, skip + 1, Math.ceil(total / size)),
      orders.map((order) => new ReturnOrderDTO(order)),
    );
  }

  async findOrdersByUserId(userId?: number, orderId?: number): Promise<ReturnOrderDTO[]> {
    const orders = (
      await this.orderRepository.find({
        where: { userId, id: orderId },
        relations: {
          address: {
            city: {
              state: true,
            },
          },
          ordersProduct: {
            product: {
              category: true,
            },
          },
          payment: {
            paymentStatus: true,
          },
          user: !!orderId,
        },
      })
    ).map((order) => new ReturnOrderDTO(order));

    if (!orders?.length) {
      throw new NotFoundException('Order not found');
    }

    return orders;
  }
}
