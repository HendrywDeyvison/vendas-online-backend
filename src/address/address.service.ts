import { CityService } from './../city/city.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  async getAllAddress(): Promise<AddressEntity[]> {
    return this.addressRepository.find();
  }

  async findAddressById(addressId: number): Promise<AddressEntity> {
    return this.addressRepository.findOne({
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
}