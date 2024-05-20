import { CityService } from './../city/city.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  async getAllAddress(): Promise<AddressEntity[]> {
    return await this.addressRepository.find();
  }

  async findAddressById(addressId: number): Promise<AddressEntity> {
    return await this.addressRepository.findOne({
      where: { id: addressId },
    });
  }

  async createAddress(createAddressDto: CreateAddressDto, userId: number): Promise<AddressEntity> {
    await this.userService.findUserById(userId);
    await this.cityService.findCityById(createAddressDto.cityId);

    return this.addressRepository.save({
      ...createAddressDto,
      userId,
    });
  }

  async findAddressByUserId(userId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: { userId },
      relations: {
        city: {
          state: true,
        },
      },
    });

    if (!addresses?.length) {
      throw new NotFoundException(`Addresses not found for userId: ${userId}`);
    }

    return addresses;
  }
}
