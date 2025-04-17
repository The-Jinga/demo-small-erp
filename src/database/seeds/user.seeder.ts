import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserRole } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    const commonPassword = 'password@123';
    const passwordHash = await bcrypt.hash(commonPassword, 10);

    const users = [
      {
        name: 'Procurement User',
        email: 'procurement@example.com',
        passwordHash,
        role: UserRole.PROCUREMENT,
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        passwordHash,
        role: UserRole.MANAGER,
      },
      {
        name: 'Inventory User',
        email: 'inventory@example.com',
        passwordHash,
        role: UserRole.INVENTORY,
      },
      {
        name: 'Finance User',
        email: 'finance@example.com',
        passwordHash,
        role: UserRole.FINANCE,
      },
    ];

    for (const user of users) {
      const newUser = repository.create(user);
      await repository.save(newUser);
    }
  }
}
