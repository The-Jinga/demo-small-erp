import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        host: '127.0.0.1', // Redis server host
        port: 6379, // Redis server port
        ttl: 600, // Time to live (seconds)
      }),
    }),
  ],
})
export class RedisModule {}
