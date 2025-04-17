import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dtos/user.dto';
import { PurchaseOrderItemDto } from './purchase-order-item.dto';
import { Permission } from '../../common/enums/permission.enum';
import { ApprovalLogDto } from './approval-log.dto';
import { SupplierDto } from '../../supplier/dtos/supplier.dto';

export class PurchaseOrderDto {
  @Expose() id: string;

  @Expose() status: string;

  @Expose({ groups: [Permission.VIEW_FINANCIAL_FIELDS] })
  totalAmount: string;

  @Expose() createdAt: Date;

  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => SupplierDto)
  supplier: SupplierDto;

  @Expose()
  @Type(() => UserDto)
  createdBy: UserDto;

  @Expose()
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];

  @Expose()
  @Type(() => ApprovalLogDto)
  approvalLog: ApprovalLogDto;
}
