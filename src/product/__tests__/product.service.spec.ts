import { ProductEntity } from './../entities/product.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { ReturnDeleteMock } from '../../__mocks__/return-delete.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryMock),
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            save: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(ReturnDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.findAllProducts();

    expect(products).toEqual([productMock]);
  });

  it('should return error if products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAllProducts()).rejects.toThrow();
  });

  it('should return error in exeption', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllProducts()).rejects.toThrow();
  });

  it('should return product by id', async () => {
    const products = await service.findProductById(productMock.id);

    expect(products).toEqual(productMock);
  });

  it('should return error if product by id empty', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  it('should return error in exeption find product by id', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  it('should return product after insert in DB', async () => {
    const product = await service.createProduct(createProductMock);

    expect(product).toEqual(productMock);
  });

  it('should return error in exeption find category by id', async () => {
    jest.spyOn(categoryService, 'findCategoryById').mockRejectedValue(new Error());

    expect(service.createProduct(createProductMock)).rejects.toThrow();
  });

  it('should return delete true in delete product', async () => {
    const products = await service.deleteProduct(productMock.id);

    expect(products).toEqual(ReturnDeleteMock);
  });

  it('should return product after update', async () => {
    const product = await service.updateProduct(updateProductMock, productMock.id);

    expect(product).toEqual(productMock);
  });

  it('should return error in update product', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

    expect(service.updateProduct(updateProductMock, productMock.id)).rejects.toThrow();
  });
});
