import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { ApprovalLog } from './entities/approval-log.entity';
import { CreatePurchaseOrderDto } from './dtos/create-purchase-order.dto';
import { PurchaseOrderStatus, UserRole } from '../common/enums';
import { ProductService } from '../product/product.service';
import { TransactionService } from '../common/transaction/transaction.service';
import { UsersService } from '../users/user.service';
import { Product } from '../product/entities/product.entity';
import { ReviewPurchaseOrderDto } from './dtos/review-purchase-order.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly mailService: MailService,
    private readonly productService: ProductService,
    private readonly transactionService: TransactionService,
    private readonly userService: UsersService,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(ApprovalLog)
    private readonly approvalLogRepository: Repository<ApprovalLog>,
  ) {}

  async findById(id: string, relations: string[] = []): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations,
    });

    if (!purchaseOrder) {
      throw new HttpException('Purchase Order not found', HttpStatus.NOT_FOUND);
    }

    return purchaseOrder;
  }

  async create(
    userId: string,
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    const user = await this.userService.findById(userId);
    const purchaseOrder = this.purchaseOrderRepository.create({
      status: PurchaseOrderStatus.DRAFT,
      createdBy: user,
      supplier: { id: createPurchaseOrderDto.supplierId },
    });

    return this.transactionService.execute(async (queryRunner: QueryRunner) => {
      await queryRunner.manager.save(purchaseOrder);
      let totalAmount = 0;
      const items = await Promise.all(
        createPurchaseOrderDto.items.map(async (item) => {
          const product = await this.productService.findOne(item.productId);
          const purchaseOrderItem = this.purchaseOrderItemRepository.create({
            purchaseOrder,
            product,
            quantity: item.quantity,
            unitPrice: product.unitPrice,
          });
          totalAmount += purchaseOrderItem.quantity * product.unitPrice;
          return purchaseOrderItem;
        }),
      );
      await queryRunner.manager.save(PurchaseOrderItem, items);
      purchaseOrder.totalAmount = totalAmount;
      await queryRunner.manager.save(purchaseOrder);
      return purchaseOrder;
    });
  }

  async submitForReview(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findById(id);

    if (purchaseOrder.status !== PurchaseOrderStatus.DRAFT) {
      throw new HttpException(
        'Only draft purchase orders can be submitted for review',
        HttpStatus.BAD_REQUEST,
      );
    }
    purchaseOrder.status = PurchaseOrderStatus.PENDING_REVIEW;
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async review(
    id: string,
    userId: string,
    reviewDto: ReviewPurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    const user = await this.userService.findById(userId);
    const purchaseOrder = await this.findById(id, ['items', 'items.product']);

    if (purchaseOrder.status !== PurchaseOrderStatus.PENDING_REVIEW) {
      throw new HttpException(
        'Only pending review purchase orders can be reviewed',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.transactionService.execute(async (queryRunner: QueryRunner) => {
      purchaseOrder.status = reviewDto.action;
      if (reviewDto.action === PurchaseOrderStatus.APPROVED) {
        const approvalLog = this.approvalLogRepository.create({
          purchaseOrder,
          approvedBy: user,
          action: reviewDto.action,
          comment: reviewDto.comment,
        });

        await queryRunner.manager.save(purchaseOrder);
        await queryRunner.manager.save(approvalLog);

        for (const item of purchaseOrder.items) {
          await queryRunner.manager.increment(
            Product,
            { id: item.product.id },
            'pendingStock',
            item.quantity,
          );
        }
      }

      const inventoryUsers = await this.userService.findByRole(
        UserRole.INVENTORY,
      );
      const inventoriesEmails = inventoryUsers.map((user) => user.email);
      await this.mailService.sendApprovalPurchaseOrder(inventoriesEmails);

      return purchaseOrder;
    });
  }

  async findAll(status?: PurchaseOrderStatus): Promise<PurchaseOrder[]> {
    return this.buildPurchaseOrderQuery(null, status).getMany();
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.buildPurchaseOrderQuery(id).getOne();
    if (!purchaseOrder) {
      throw new HttpException('Purchase order not found', HttpStatus.NOT_FOUND);
    }
    return purchaseOrder;
  }

  private buildPurchaseOrderQuery(id?: string, status?: PurchaseOrderStatus) {
    const query = this.purchaseOrderRepository
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier')
      .leftJoinAndSelect('po.createdBy', 'createdBy')
      .leftJoinAndSelect('po.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('po.approvalLog', 'approvalLog')
      .leftJoinAndSelect('approvalLog.approvedBy', 'approvedBy');

    if (id) {
      query.where('po.id = :id', { id });
    }

    if (status) {
      query.andWhere('po.status = :status', { status });
    }

    console.log(query);

    return query;
  }
}
