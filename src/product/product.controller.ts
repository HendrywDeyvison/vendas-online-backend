import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { ReturnProductDTO } from './dtos/return-product.dto';

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
}
