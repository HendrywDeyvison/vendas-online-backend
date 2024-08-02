import { CartProductEntity } from './../cart-product/entities/cart-product.entity';
import { CartEntity } from './../cart/entities/cart.entity';
import { ProductEntity } from './../product/entities/product.entity';
import { PaymentType } from './../payment-status/enum/payment-type.enum';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentEntity } from './entities/payment.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDTO } from '../order/dtos/create-order.dto';
import { Repository } from 'typeorm';
import { PaymentPixEntity } from './entities/payment-pix.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  generateFinalPrice(cart: CartEntity, products: ProductEntity[]) {
    if (!cart?.cartProduct?.length) {
      return 0;
    }

    return cart.cartProduct
      .map((cartProduct: CartProductEntity) => {
        const product = products.find((product) => product.id == cartProduct.productId);

        if (product) {
          return cartProduct.amount * product.price;
        }

        return 0;
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  async createPayment(
    createOrderDTO: CreateOrderDTO,
    products: ProductEntity[],
    cart: CartEntity,
  ): Promise<PaymentEntity> {
    const finalPrice = this.generateFinalPrice(cart, products);

    if (createOrderDTO.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrderDTO.codePix && createOrderDTO.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException('Amount Payments or Code Pix and Date Payment not found');
  }
}
