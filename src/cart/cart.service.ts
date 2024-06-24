import { ProductService } from './../product/product.service';
import { CartProductService } from './../cart-product/cart-product.service';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CartEntity } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

const LINE_AFFECTED = 1;

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
    private readonly productService: ProductService,
  ) {}

  async clearCart(userId: number): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId);

    await this.cartRepository.save({
      ...cart,
      active: false,
    });

    return {
      raw: [],
      affected: LINE_AFFECTED,
    };
  }

  async findCartByUserId(userId: number, isRelations: boolean = false): Promise<CartEntity> {
    const relations = isRelations
      ? {
          cartProduct: {
            product: true,
          },
        }
      : undefined;

    const cartUser = await this.cartRepository.findOne({
      where: { userId, active: true },
      relations,
    });

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
    await this.productService.findProductById(insertCartDTO.productId);

    const cart = await this.findCartByUserId(userId).catch(() => {
      return this.createCart(userId);
    });

    this.cartProductService.insertProductInCart(insertCartDTO, cart);
    //return this.findCartByUserId(userId, true);

    return cart;
  }
}
