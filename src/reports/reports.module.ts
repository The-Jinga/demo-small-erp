import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransaction } from '../inventory/entities/inventory-transaction.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { CacheModule } from '../cache/cache.module';
import { ReportSchedule } from './report.schedule';
import { BullModule } from '@nestjs/bullmq';
import { ReportProcessor } from './report.processor';

@Module({
  imports: [
    CacheModule,
    TypeOrmModule.forFeature([InventoryTransaction, PurchaseOrder]),
    BullModule.registerQueue({
      name: 'report-queue',
    }),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportSchedule, ReportProcessor],
  exports: [ReportsService],
})
export class ReportsModule {}
