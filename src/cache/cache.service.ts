import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get<T = any>(key: string): Promise<T | undefined> {
    return await this.cache.get(key);
  }

  async set<T = any>(
    key: string,
    value: T,
    ttl?: number | string,
  ): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const redis = (this.cache as any).opts.store.redis as any;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
