import { Injectable, NotFoundException } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllCities(): Promise<CityEntity[]> {
    return await this.cityRepository.find();
  }

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[] | any> {
    return await this.cacheService.getCacheData<CityEntity[]>(`${stateId}`, () =>
      this.cityRepository.find({
        where: {
          stateId,
        },
      }),
    );
  }

  async findCityById(cityId: number): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
    });

    if (!city) {
      throw new NotFoundException(`CityId: ${cityId} not found`);
    }

    return city;
  }
}
