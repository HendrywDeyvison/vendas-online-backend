import { CartEntity } from './../cart/entities/cart.entity';
import { InsertCartDTO } from './../cart/dtos/insert-cart.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CartProductEntity } from './entities/cart-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
  ) {}

  async verifyProductInCart(productId: number, cartId: number): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException('Product not found in cart');
    }

    return cartProduct;
  }

  async createProductInCart(
    insertCartDTO: InsertCartDTO,
    cartId: number,
  ): Promise<CartProductEntity> {
    return await this.cartProductRepository.save({
      ...insertCartDTO,
      cartId,
    });
  }

  async insertProductInCart(
    insertCartDTO: InsertCartDTO,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    const cartProduct = await this.verifyProductInCart(insertCartDTO.productId, cart.id).catch(
      () => undefined,
    );

    if (!cartProduct) {
      return this.createProductInCart(insertCartDTO, cart.id);
    }

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + insertCartDTO.amount,
    });
  }
}
