import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryTransaction } from '../inventory/entities/inventory-transaction.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ReportsService {
  private readonly SUPPLIER_SPENT_REPORT_CACHE_KEY = 'supplier-spent-report';

  constructor(
    private readonly cacheService: CacheService,
    @InjectRepository(InventoryTransaction)
    private readonly inventoryTransactionRepository: Repository<InventoryTransaction>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  async getInventoryTurnover(startDate: Date, endDate: Date) {
    const results = await this.inventoryTransactionRepository
      .createQueryBuilder('transaction')
      .select([
        'product.id as productId',
        'product.name as productName',
        'SUM(CASE WHEN transaction.type = :stockIn THEN transaction.quantity ELSE 0 END) as totalIn',
        'SUM(CASE WHEN transaction.type = :stockOut THEN transaction.quantity ELSE 0 END) as totalOut',
      ])
      .innerJoin('transaction.product', 'product')
      .where('transaction.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
        stockIn: 'stock_in',
        stockOut: 'stock_out',
      })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .getRawMany();

    return results.map((result) => {
      const totalIn = parseInt(result.totalin);
      const totalOut = parseInt(result.totalout);
      const avgInventory = (totalIn + totalOut) / 2;
      const turnoverRate = avgInventory > 0 ? totalOut / avgInventory : 0;

      return {
        productId: result.productid,
        productName: result.productname,
        totalIn,
        totalOut,
        turnoverRate,
      };
    });
  }

  async getSupplierSpending(forceRefresh = false) {
    if (!forceRefresh) {
      const results = await this.cacheService.get(
        this.SUPPLIER_SPENT_REPORT_CACHE_KEY,
      );
      if (results) {
        return results;
      }
    }
    const results = await this.purchaseOrderRepository
      .createQueryBuilder('po')
      .select([
        'supplier.id AS supplierId',
        'supplier.name AS supplierName',
        `DATE_TRUNC('month', po."createdAt") AS month`,
        `COALESCE(SUM(inventory_summary."totalQuantity" * poi."unitPrice"),0) AS totalSpent`,
        `COUNT(DISTINCT po.id) AS orderCount`,
      ])
      .innerJoin('po.supplier', 'supplier')
      .leftJoin('po.items', 'poi')
      .leftJoin(
        (qb) =>
          qb
            .select([
              '"relatedPoId"',
              '"productId"',
              'SUM("quantity") AS "totalQuantity"',
            ])
            .from('inventory_transactions', 'it')
            .groupBy('"relatedPoId"')
            .addGroupBy('"productId"'),
        'inventory_summary',
        'inventory_summary."relatedPoId" = poi."purchaseOrderId" AND inventory_summary."productId" = poi."productId"',
      )
      .groupBy('supplier.id')
      .addGroupBy(`DATE_TRUNC('month', po."createdAt")`)
      .addGroupBy('po.id')
      .orderBy('supplier.id', 'ASC')
      .addOrderBy('month', 'ASC')
      .getRawMany();

    const groupedResults = results.reduce((acc, row) => {
      if (!acc[row.supplierid]) {
        acc[row.supplierid] = {
          supplierId: row.supplierid,
          supplierName: row.suppliername,
          monthlyData: [],
        };
      }

      acc[row.supplierid].monthlyData.push({
        month: row.month.toISOString().slice(0, 7),
        totalSpent: parseFloat(row.totalspent),
        averageOrderValue:
          parseFloat(row.totalspent) / parseInt(row.ordercount),
        orderCount: parseInt(row.ordercount),
      });
      return acc;
    }, {});
    const data = Object.values(groupedResults);

    return data;
  }

  async updateSupplierSpendingCache() {
    const data = await this.getSupplierSpending(true);
    await this.cacheService.set(
      this.SUPPLIER_SPENT_REPORT_CACHE_KEY,
      data,
      86400,
    );
    return this.getSupplierSpending(true);
  }
}
