import { ConfigService } from '@nestjs/config';
import { connectionSource } from 'src/config/typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async () => {
      if (!connectionSource.isInitialized) {
        await connectionSource.initialize();
      }
      return connectionSource;
    },
  },
];
