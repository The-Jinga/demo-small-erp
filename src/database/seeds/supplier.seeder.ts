import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Supplier } from '../../supplier/entities/supplier.entity';

export default class SupplierSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Supplier);

    const suppliers = [
      {
        name: 'ABC Construction Supply',
        email: 'sales@abcconstruction.com',
        creditLimit: 50000.0,
      },
      {
        name: 'XYZ Industrial Equipment',
        email: 'contact@xyzindustrial.com',
        creditLimit: 100000.0,
      },
      {
        name: 'Global Manufacturing Co.',
        email: 'info@globalmanufacturing.com',
        creditLimit: 75000.0,
      },
      {
        name: 'Tech Machinery Ltd.',
        email: 'sales@techmachinery.com',
        creditLimit: 60000.0,
      },
      {
        name: 'Premium Tools & Equipment',
        email: 'support@premiumtools.com',
        creditLimit: 45000.0,
      },
    ];

    for (const supplier of suppliers) {
      const newSupplier = repository.create(supplier);
      await repository.save(newSupplier);
    }
  }
}
