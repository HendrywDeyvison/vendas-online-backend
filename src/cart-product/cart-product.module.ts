import { CartProductEntity } from './entities/cart-product.entity';
import { Module } from '@nestjs/common';
import { CartProductService } from './cart-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CartProductEntity])],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
