import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { InventoryModule } from './inventory/inventory.module';
import { QueueModule } from './queue/queue.module';
import { ReportsModule } from './reports/reports.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ProductModule,
    PurchaseOrderModule,
    InventoryModule,
    SupplierModule,
    QueueModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
