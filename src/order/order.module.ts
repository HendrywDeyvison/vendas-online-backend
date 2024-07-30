import { OrderProductModule } from './../order-product/order-product.module';
import { CartModule } from './../cart/cart.module';
import { PaymentModule } from './../payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), PaymentModule, CartModule, OrderProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
