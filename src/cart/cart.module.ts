import { ProductModule } from './../product/product.module';
import { CartProductModule } from './../cart-product/cart-product.module';
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity]), CartProductModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
