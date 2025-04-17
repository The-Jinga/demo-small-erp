import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Product);
    const products = [
      {
        name: 'Cement',
        sku: 'CMT-123',
        category: 'Building Materials',
        unitPrice: 100.0,
        stock: 0,
        pendingStock: 0,
      },
      {
        name: 'Steel Rod',
        sku: 'STR-456',
        category: 'Building Materials',
        unitPrice: 150.0,
        stock: 0,
        pendingStock: 0,
      },
      {
        name: 'Conveyor Belt',
        sku: 'CVB-789',
        category: 'Manufacturing',
        unitPrice: 250.0,
        stock: 0,
        pendingStock: 0,
      },
      {
        name: 'Industrial Fan',
        sku: 'IFN-321',
        category: 'Machinery',
        unitPrice: 300.0,
        stock: 0,
        pendingStock: 0,
      },
      {
        name: 'Piping System',
        sku: 'PS-654',
        category: 'Plumbing',
        unitPrice: 200.0,
        stock: 0,
        pendingStock: 0,
      },
    ];

    for (const product of products) {
      const newProduct = repository.create(product);
      await repository.save(newProduct);
    }
  }
}
