import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { AuditLog } from './entities/audit-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TransactionModule } from 'src/common/transaction/transaction.module';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    TransactionModule,
    ProductModule,
    PurchaseOrderModule,
    UsersModule,
    TypeOrmModule.forFeature([InventoryTransaction, AuditLog]),
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
