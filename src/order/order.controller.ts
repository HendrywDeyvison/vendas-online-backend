import { UserType } from './../user/enum/user-type.enum';
import { Roles } from './../decorators/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/user-id-decorator';
import { ReturnOrderDTO } from './dtos/return-order.dto';
import { Response } from 'express';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Roles(UserType.Admin, UserType.Root, UserType.User)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async createOrder(@Body() createOrderDTO: CreateOrderDTO, @UserId() userId: number) {
    return await this.orderService.createOrder(createOrderDTO, userId);
  }

  @Get('')
  async findOrdersByUserId(
    @UserId() userId: number,
    @Res({ passthrough: true }) res?: Response,
  ): Promise<ReturnOrderDTO[]> {
    const orders = await this.orderService.findOrdersByUserId(userId).catch(() => undefined);

    if (orders) {
      return orders;
    }

    res.status(HttpStatus.NO_CONTENT).send();

    return;
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/all')
  async findAllOrders(): Promise<PaginationDto<ReturnOrderDTO[]>> {
    return await this.orderService.findAllOrders();
  }

  @Roles(UserType.Admin, UserType.Root)
  @Get('/:orderId')
  async findOrdersByOrderId(@Param('orderId') orderId: number): Promise<ReturnOrderDTO[]> {
    return await this.orderService.findOrdersByUserId(undefined, orderId);
  }
}
