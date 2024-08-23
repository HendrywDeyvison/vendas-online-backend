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

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async findAllCategories(isRelations: boolean = false): Promise<ReturnCategoryDto[]> {
    const relations = {
      products: isRelations ? true : false,
    };

    const categories = await this.categoryRepository.find({
      relations,
    });

    if (!categories || !categories?.length) {
      throw new NotFoundException('Categories empty');
    }

    const categoryWithCounts = await Promise.all(
      categories.map(async (category) => {
        const amountProducts = await this.productService.amountProductByCategoryId(category.id);
        return new ReturnCategoryDto(category, amountProducts?.total);
      }),
    );

    return categoryWithCounts;
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
