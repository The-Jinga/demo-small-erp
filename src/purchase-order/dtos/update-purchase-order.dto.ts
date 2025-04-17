import { IsEnum, IsString } from 'class-validator';
import { PurchaseOrderStatus } from 'src/common/enums';

export class UpdatePurchaseOrderStatusDto {
  @IsEnum(PurchaseOrderStatus)
  status: PurchaseOrderStatus;

  @IsString()
  purchaseOrderId: string;
}
