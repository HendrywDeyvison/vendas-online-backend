import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategory } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || !categories?.length) {
      throw new NotFoundException('Categories empty');
    }

    return categories;
  }

  async findCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category id: ${id} not found`);
    }

    return category;
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
