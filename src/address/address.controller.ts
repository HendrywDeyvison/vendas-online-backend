import { AddressService } from './address.service';
import { Controller, Param, Post, UsePipes, ValidationPipe, Get, Body } from '@nestjs/common';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/')
  async getAllAddress(): Promise<AddressEntity[]> {
    return this.addressService.getAllAddress();
  }

  @Get('/:addressId')
  async findAddressById(@Param('addressId') addressId: number): Promise<AddressEntity> {
    return this.addressService.findAddressById(addressId);
  }

  @Post('/:userId')
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @Param('userId') userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, userId);
  }
}
