import { cartMock } from './../../cart/__mocks__/cart.mock';
import { productMock } from './../../product/__mocks__/product.mock';
import { ProductService } from './../../product/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';

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
            findOne: '',
            save: '',
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
});
