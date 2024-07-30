import { OrderProductEntity } from './entities/order-product.entity';
import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProductEntity])],
  providers: [OrderProductService],
  exports: [OrderProductService],
})
export class OrderProductModule {}
