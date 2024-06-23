import { CartProductService } from './../cart-product/cart-product.service';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CartEntity } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
  ) {}

  async getUserCart(userId: number): Promise<CartEntity> {
    const cartUser = await this.cartRepository.findOne({ where: { userId } });

    if (!cartUser) {
      throw new NotFoundException(`no active carts found`);
    }

    return cartUser;
  }

  async verifyActiveCart(userId: number): Promise<CartEntity> {
    const cartUser = await this.cartRepository.findOne({ where: { userId } });

    if (!cartUser) {
      throw new NotFoundException(`no active carts found`);
    }

    return cartUser;
  }

  async createCart(userId: number): Promise<CartEntity> {
    return this.cartRepository.save({
      userId,
      active: true,
    });
  }

  async insertProductInCart(insertCartDTO: InsertCartDTO, userId: number): Promise<CartEntity> {
    const cart = await this.verifyActiveCart(userId).catch(() => {
      return this.createCart(userId);
    });

    this.cartProductService.insertProductInCart(insertCartDTO, cart);
    return cart;
  }
}
