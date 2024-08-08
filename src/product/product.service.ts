import { ReturnAmountProductDto } from './dtos/return-amount-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, In, Repository } from 'typeorm';
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

  async findProductById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(updateProduct: UpdateProductDTO, productId: number): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }
  //!COLOCAR ESSA FUNCAO NO SERVICE DE CATEGORY
  async amountProductByCategoryId(categoryId?: number): Promise<ReturnAmountProductDto> {
    const amountProduct = await this.productRepository
      .createQueryBuilder('product')
      .select('product.categoryId', 'categoryId')
      .addSelect('COUNT(product.id)', 'productCount')
      .where('product.categoryId = :categoryId', { categoryId })
      .groupBy('product.categoryId')
      .getRawOne();

    return new ReturnAmountProductDto(amountProduct);
  }
}
