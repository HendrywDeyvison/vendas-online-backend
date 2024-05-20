import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { addressMock } from '../__mocks__/address.mock';
import { UserService } from '../../user/user.service';
import { UserEntityMock } from '../../user/__mocks__/user.mock';
import { CityService } from '../../city/city.service';
import { cityMock } from '../../city/__mocks__/city.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let userService: UserService;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(UserEntityMock),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue(cityMock),
          },
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue([addressMock]),
            find: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get<Repository<AddressEntity>>(getRepositoryToken(AddressEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should return address after to save', async () => {
    const address = await service.createAddress(createAddressMock, UserEntityMock.id);
    expect(address).toEqual([addressMock]);
  });

  it('should return error in exception in userService', async () => {
    jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(new Error());

    expect(service.createAddress(createAddressMock, UserEntityMock.id)).rejects.toThrow();
  });

  it('should return error in exception in userService', async () => {
    jest.spyOn(cityService, 'findCityById').mockRejectedValueOnce(new Error());

    expect(service.createAddress(createAddressMock, UserEntityMock.id)).rejects.toThrow();
  });

  it('should return all addresses to user', async () => {
    const addresses = await service.findAddressByUserId(UserEntityMock.id);

    expect(addresses).toEqual([addressMock]);
  });

  it('should return not found if not address registred', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValueOnce(undefined);

    expect(service.findAddressByUserId(UserEntityMock.id)).rejects.toThrow();
  });
});
