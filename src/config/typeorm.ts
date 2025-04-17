import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension/dist/seeder/type';
import { Product } from '../product/entities/product.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import { join } from 'path';
import { User } from '../users/entities/user.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  seeds: [join(__dirname, '..', 'database', 'seeds', '**', '*{.ts,.js}')],
  synchronize: false,
  autoLoadEntities: true,
} as DataSourceOptions;

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource({
  ...config,
  entities: [Product, Supplier, User],
} as DataSourceOptions & SeederOptions);
