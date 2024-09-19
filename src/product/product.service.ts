import { ReturnAmountProductDto } from './dtos/return-amount-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { CategoryService } from '../category/category.service';
import { ReturnProductDTO } from './dtos/return-product.dto';
import { PaginationDto, PaginationMeta } from 'src/dtos/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  DEFAULT_PAGE_SIZE = 10;
  FIRST_PAGE = 0;

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

  async findAllProductsByParams(
    productId?: number,
    productName?: string,
    size: number = this.DEFAULT_PAGE_SIZE,
    page: number = this.FIRST_PAGE,
    isFindRelations: boolean = false,
  ): Promise<PaginationDto<ReturnProductDTO[]>> {
    const skip = (page - 1) * size;
    let findOptions = {};

    if (productId) {
      findOptions = {
        where: { id: productId },
      };
    }

    if (productName?.length > 0) {
      findOptions = {
        where: { name: ILike(`%${productName}%`) },
      };
    }

    findOptions = {
      ...findOptions,
      order: {
        id: 'ASC',
      },
      take: size,
      skip,
      relations: {
        category: isFindRelations,
      },
    };

    const [products, total] = await this.productRepository.findAndCount(findOptions);

    return new PaginationDto(
      new PaginationMeta(size, total, skip + 1, Math.ceil(total / size)),
      products.map((product) => new ReturnProductDTO(product)),
    );
  }
}
