import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PurchaseOrder, PurchaseOrderItem } from './entities';
// import { ApprovalLog } from './entities/approval-log.entity';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';
import { UsersModule } from '../users/user.module';
import { ProductModule } from '../product/product.module';
import { TransactionModule } from 'src/common/transaction/transaction.module';
import { ApprovalLog } from './entities/approval-log.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    ProductModule,
    TransactionModule,
    MailModule,
    TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderItem, ApprovalLog]),
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
