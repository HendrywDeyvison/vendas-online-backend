import { ReturnAmountProductDto } from './dtos/return-amount-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({ ...createProduct });
  }

  async findAllProducts(
    productId?: number[],
    isFindRelations: boolean = false,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId?.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || !products?.length) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async findProductById(id: number, isFindRelations: boolean = true): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: isFindRelations,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${id} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({ ...product, active: false, updatedAt: new Date() });
  }

  async updateProduct(updateProduct: UpdateProductDTO, productId: number): Promise<ProductEntity> {
    const product = await this.findProductById(productId, false);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
      updatedAt: new Date(),
    });
  }

  async amountProductByCategoryId(categoryId?: number): Promise<ReturnAmountProductDto> {
    const amountProduct = await this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(product.id) as total')
      .where('product.category_id = :categoryId', { categoryId })
      .groupBy('product.categoryId')
      .getRawOne();

    return amountProduct;
  }
}
