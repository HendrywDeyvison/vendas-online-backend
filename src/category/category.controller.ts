import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dtos/create-category.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    return (await this.categoryService.findAllCategories()).map(
      (category) => new ReturnCategoryDto(category),
    );
  }

  @Get('/:categoryId')
  async findCategoryById(@Param('categoryId') categoryId: number): Promise<ReturnCategoryDto> {
    return this.categoryService.findCategoryById(categoryId);
  }

  @Roles(UserType.Admin)
  @UsePipes()
  @Post()
  async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
    return await this.categoryService.createCategory(createCategory);
  }
}
