import { PaginationDto } from 'src/dtos/pagination.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnProductDTO } from './dtos/return-product.dto';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllProductsByParams(
    @Query('id') productId: number,
    @Query('name') productName: string,
    @Query('size') size: number,
    @Query('page') page: number = 1,
  ): Promise<PaginationDto<ReturnProductDTO[]>> {
    return this.productService.findAllProductsByParams(productId, productName, size, page, false);
  }

  @Get('/all')
  async findAllProducts(): Promise<ReturnProductDTO[]> {
    return (await this.productService.findAllProducts(undefined, true)).map(
      (product) => new ReturnProductDTO(product),
    );
  }

  @Get('/:productId')
  async findProductById(@Param('productId') productId: number): Promise<ReturnProductDTO> {
    return new ReturnProductDTO(await this.productService.findProductById(productId));
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(@Body() createProductDTO: CreateProductDTO): Promise<ProductEntity> {
    return await this.productService.createProduct(createProductDTO);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: number): Promise<ProductEntity> {
    return await this.productService.deleteProduct(productId);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put('/:productId')
  async updateProduct(
    @Body() updateProduct: UpdateProductDTO,
    @Param('productId') productId: number,
  ): Promise<ProductEntity> {
    return await this.productService.updateProduct(updateProduct, productId);
  }
}
