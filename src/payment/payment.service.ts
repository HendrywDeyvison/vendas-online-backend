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

  async createPayment(createOrderDTO: CreateOrderDTO): Promise<PaymentEntity> {
    if (createOrderDTO.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrderDTO.codePix && createOrderDTO.datePayment) {
      const paymentPix = new PaymentPixEntity(PaymentType.Done, 0, 0, 0, createOrderDTO);
      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException('Amount Payments or Code Pix and Date Payment not found');
  }
}
