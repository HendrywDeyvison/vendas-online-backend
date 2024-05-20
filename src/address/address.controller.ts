import { AddressService } from './address.service';
import { Controller, Param, Post, UsePipes, ValidationPipe, Get, Body } from '@nestjs/common';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id-decorator';
import { ReturnAddressDto } from './dtos/returnAddress.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /*@Get('/ ')
  async getAllAddress(): Promise<ReturnAddressDto[]> {
    return (await this.addressService.getAllAddress()).map(
      (address) => new ReturnAddressDto(address),
    );
  }*/

  @Get('/:addressId')
  async findAddressById(@Param('addressId') addressId: number): Promise<AddressEntity> {
    return this.addressService.findAddressById(addressId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, userId);
  }

  @Get()
  async findAddressByUserId(@UserId() userId: number): Promise<ReturnAddressDto[]> {
    return (await this.addressService.findAddressByUserId(userId)).map(
      (address) => new ReturnAddressDto(address),
    );
  }
}
