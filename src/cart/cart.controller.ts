import { ReturnCartDTO } from './dtos/return-cart.dto';
import { UserId } from './../decorators/user-id-decorator';
import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { CartService } from './cart.service';

@Roles(UserType.Admin, UserType.User)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(await this.cartService.findCartByUserId(userId, true));
  }

  @UsePipes(ValidationPipe)
  @Post()
  async createCart(
    @Body() insertCart: InsertCartDTO,
    @UserId() userId: number,
  ): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(await this.cartService.insertProductInCart(insertCart, userId));
  }
}
