import { UpdateCategory } from './dtos/update-category.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dtos/create-category.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    return this.categoryService.findAllCategories();
  }

  @Get('/:categoryId')
  async findCategoryById(@Param('categoryId') categoryId: number): Promise<ReturnCategoryDto> {
    return this.categoryService.findCategoryById(categoryId);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
    return await this.categoryService.createCategory(createCategory);
  }

  @UsePipes(ValidationPipe)
  @Put('/:categoryId')
  async updateCategory(
    @Body() updateCategory: UpdateCategory,
    @Param('categoryId') categoryId: number,
  ): Promise<ReturnCategoryDto> {
    return this.categoryService.updateCategory(updateCategory, categoryId);
  }

  @Delete('/:categoryId')
  async deleteCategory(@Param('categoryId') categoryId: number): Promise<ReturnCategoryDto> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
