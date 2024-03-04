import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCacheData<T>(key: string, functionRequest: () => Promise<T>): Promise<T> {
    const allDataCache: T = await this.cacheManager.get(key);

    if (allDataCache) {
      return allDataCache;
    }

    const newData: T = await functionRequest();

    await this.cacheManager.set(key, newData);

    return newData;
  }
}
