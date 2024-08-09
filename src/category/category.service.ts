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

  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find({
      relations: ['products'],
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

  async findCategoryById(id: number): Promise<ReturnCategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
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
}
