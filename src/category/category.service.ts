import { UpdateCategory } from './dtos/update-category.dto';
import { ProductService } from './../product/product.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategory } from './dtos/create-category.dto';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { PaginationDto, PaginationMeta } from 'src/dtos/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  DEFAULT_PAGE_SIZE = 10;
  FIRST_PAGE = 1;

  async findAllCategories(
    isRelations: boolean = false,
    size: number = this.DEFAULT_PAGE_SIZE,
    page: number = this.FIRST_PAGE,
  ): Promise<PaginationDto<ReturnCategoryDto[]>> {
    page = Number(page) ? page : this.FIRST_PAGE;
    const take = Number(size) ? size : this.DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * size;

    const findOptions = {
      order: {
        id: 'ASC' as const,
      },
      take,
      skip,
      relations: {
        products: isRelations,
      },
    };

    const [categories, total] = await this.categoryRepository.findAndCount(findOptions);

    const categoryWithCounts = await Promise.all(
      categories.map(async (category) => {
        const amountProducts = await this.productService.amountProductByCategoryId(category.id);
        return new ReturnCategoryDto(category, amountProducts?.total);
      }),
    );

    return new PaginationDto(
      new PaginationMeta(size, total, skip + 1, Math.ceil(total / size)),
      categoryWithCounts,
    );
  }

  async findCategoryById(id: number, isRelations: boolean = true): Promise<ReturnCategoryDto> {
    const relations = {
      products: isRelations ? true : false,
    };
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations,
    });
    const amountProducts = await this.productService.amountProductByCategoryId(id);

    if (!category) {
      throw new NotFoundException(`Category id: ${id} not found`);
    }

    return new ReturnCategoryDto(category, amountProducts?.total);
  }

  async findCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { name } });

    if (!category) {
      throw new NotFoundException('Category empty');
    }

    return category;
  }

  async createCategory(createCategory: CreateCategory): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(createCategory.name).catch(() => undefined);

    if (category) {
      throw new BadRequestException(`Category name: '${createCategory.name}' already exists`);
    }

    return await this.categoryRepository.save(createCategory);
  }

  async updateCategory(
    updateCategory: UpdateCategory,
    categoryId: number,
  ): Promise<ReturnCategoryDto> {
    const category = await this.findCategoryById(categoryId);

    if (!category) {
      throw new BadRequestException(`Category id: ${categoryId} not found`);
    }

    return new ReturnCategoryDto(
      await this.categoryRepository.save({ ...category, ...updateCategory, updatedAt: new Date() }),
    );
  }

  async deleteCategory(categoryId: number): Promise<ReturnCategoryDto> {
    const category = await this.findCategoryById(categoryId);

    if (category.products?.length > 0) {
      throw new BadRequestException(`Category id: ${categoryId} has products`);
    }

    return new ReturnCategoryDto(
      await this.categoryRepository.save({ ...category, active: false, updatedAt: new Date() }),
    );
  }
}
