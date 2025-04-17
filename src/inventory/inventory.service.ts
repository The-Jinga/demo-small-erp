import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { AuditLog } from './entities/audit-log.entity';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { PurchaseOrderStatus } from '../common/enums';
import { TransactionService } from '../common/transaction/transaction.service';
import { Product } from 'src/product/entities/product.entity';
import { ReceiveGoodsDto } from './dtos/receive-goods.dto';
import { UsersService } from '../users/user.service';
import { StockOutDto } from './dtos/stock-out.dto';

@Injectable()
export class InventoryService {
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private transactionService: TransactionService,
    private userService: UsersService,
    @InjectRepository(InventoryTransaction)
    private inventoryTransactionRepository: Repository<InventoryTransaction>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<InventoryTransaction>,
  ) {}

  async stockIn(
    purchaseOrderId,
    receiveGoodsDto: ReceiveGoodsDto,
    userId,
  ): Promise<void> {
    const user = await this.userService.findById(userId);

    const purchaseOrder = await this.purchaseOrderService.findById(
      purchaseOrderId,
      ['items', 'items.product'],
    );

    if (purchaseOrder.status !== PurchaseOrderStatus.APPROVED) {
      throw new HttpException(
        'Can only receive goods for approved purchase orders',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.transactionService.execute(async (queryRunner: QueryRunner) => {
      const inventoryTransactions: InventoryTransaction[] = [];

      for (const receiveItem of receiveGoodsDto.items) {
        const purchaseOrderItem = purchaseOrder.items.find(
          (item) => item.product.id === receiveItem.productId,
        );

        if (!purchaseOrderItem) {
          throw new HttpException(
            `Product ${receiveItem.productId} not found in purchase order`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (
          receiveItem.quantity > purchaseOrderItem.quantity ||
          receiveItem.quantity > purchaseOrderItem.product.pendingStock
        ) {
          throw new HttpException(
            `Received quantity for product ${receiveItem.productId} exceeds ordered quantity`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const transaction = queryRunner.manager.create(InventoryTransaction, {
          product: purchaseOrderItem.product,
          quantity: receiveItem.quantity,
          type: 'stock_in',
          relatedPo: purchaseOrder,
          performedBy: user,
        });
        inventoryTransactions.push(transaction);

        await queryRunner.manager
          .createQueryBuilder()
          .update(Product)
          .set({
            stock: () => `stock + ${receiveItem.quantity}`,
            pendingStock: () => `pendingStock - ${receiveItem.quantity}`,
          })
          .where('id = :id', { id: purchaseOrderItem.product.id })
          .execute();
      }

      await queryRunner.manager.save(
        InventoryTransaction,
        inventoryTransactions,
      );
    });
  }

  async stockOut(stockOutDto: StockOutDto, userId: string): Promise<void> {
    const user = await this.userService.findById(userId);

    await this.transactionService.execute(async (queryRunner: QueryRunner) => {
      const inventoryTransactions: InventoryTransaction[] = [];

      const productIds = stockOutDto.items.map((item) => item.productId);

      const products = await queryRunner.manager
        .createQueryBuilder(Product, 'product')
        .where('product.id IN (:...ids)', { ids: productIds })
        .getMany();

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      for (const item of stockOutDto.items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new HttpException(
            `Product ${item.productId} not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (item.quantity > product.stock) {
          throw new HttpException(
            `Stock out quantity for product ${item.productId} exceeds current stock or pending stock`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const transaction = queryRunner.manager.create(InventoryTransaction, {
          product,
          quantity: item.quantity,
          type: 'stock_out',
          performedBy: user,
          note: item.note,
        });
        inventoryTransactions.push(transaction);

        await queryRunner.manager
          .createQueryBuilder()
          .update(Product)
          .set({
            stock: () => `stock - ${item.quantity}`,
          })
          .where('id = :id', { id: product.id })
          .execute();
      }

      await queryRunner.manager.save(
        InventoryTransaction,
        inventoryTransactions,
      );
    });
  }

  async getTransactions(): Promise<InventoryTransaction[]> {
    const query = this.inventoryTransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.product', 'product')
      .leftJoinAndSelect('transaction.relatedPo', 'relatedPo')
      .leftJoinAndSelect('transaction.performedBy', 'performedBy')
      .orderBy('transaction.createdAt', 'DESC');
    return query.getMany();
  }
}
