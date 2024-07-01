import { updateCartMock } from './../../cart/__mocks__/update-cart.mock copy';
import { cartProductMock } from './../__mocks__/cart-product.mock';
import { InsertCartMock } from './../../cart/__mocks__/insert-cart.mock';
import { cartMock } from './../../cart/__mocks__/cart.mock';
import { productMock } from './../../product/__mocks__/product.mock';
import { ProductService } from './../../product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { NotFoundException } from '@nestjs/common';

describe('CartProductService', () => {
  let service: CartProductService;
  let productService: ProductService;
  let cartProductRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productMock.id),
          },
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            save: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(ReturnDeleteMock),
          },
        },
        CartProductService,
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return Delete Result after delete product', async () => {
    const deleteResult = await service.deleteProductCart(productMock.id, cartMock.id);

    expect(deleteResult).toEqual(ReturnDeleteMock);
  });

  it('should return error in exception delete', async () => {
    jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error('error'));

    expect(service.deleteProductCart(productMock.id, cartMock.id)).rejects.toThrow();
  });

  it('should return CartProduct after create', async () => {
    const cartProduct = await service.createProductInCart(InsertCartMock, cartMock.id);

    expect(cartProduct).toEqual(cartProductMock);
  });

  it('should return error in exception create', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error('error'));

    expect(service.createProductInCart(InsertCartMock, cartMock.id)).rejects.toThrow();
  });

  it('should return CartProduct is exist', async () => {
    const cartProduct = await service.verifyProductInCart(productMock.id, cartMock.id);

    expect(cartProduct).toEqual(cartProductMock);
  });

  it('should return error in exception verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.verifyProductInCart(productMock.id, cartMock.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return CartProduct after insert product in cart', async () => {
    const cartProduct = await service.insertProductInCart(updateCartMock, cartMock);

    expect(cartProduct).toEqual(cartProductMock);
  });

  it('should return error in exception insertProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error('error'));

    expect(service.insertProductInCart(updateCartMock, cartMock)).rejects.toThrow();
  });

  it('should return CartProduct after update', async () => {
    const cartProduct = await service.updateProductInCart(updateCartMock, cartMock);

    expect(cartProduct).toEqual(cartProductMock);
  });

  it('should return error in exception update', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error('error'));

    expect(service.updateProductInCart(updateCartMock, cartMock)).rejects.toThrow();
  });
});
