import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnProductDTO } from './dtos/return-product.dto';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { DeleteResult } from 'typeorm';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async findAllProducts(): Promise<ReturnProductDTO[]> {
    return (await this.productService.findAllProducts()).map(
      (product) => new ReturnProductDTO(product),
    );
  }

  @Get('/:productId')
  async findProductById(@Param('productId') productId: number): Promise<ReturnProductDTO> {
    return new ReturnProductDTO(await this.productService.findProductById(productId));
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(@Body() createProductDTO: CreateProductDTO): Promise<ProductEntity> {
    return await this.productService.createProduct(createProductDTO);
  }

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: number): Promise<DeleteResult> {
    return await this.productService.deleteProduct(productId);
  }
}
