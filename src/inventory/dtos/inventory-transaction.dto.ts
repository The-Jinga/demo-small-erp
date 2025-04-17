import { Expose, Type } from 'class-transformer';
import { PurchaseOrderDto } from 'src/purchase-order/dtos/purchase-order.dto';
import { ProductDto } from 'src/product/dtos/product.dto';
import { UserDto } from 'src/users/dtos/user.dto';

export class InventoryTransactionDto {
  @Expose()
  id: string;

  @Expose()
  type: 'stock_in' | 'stock_out';

  @Expose()
  quantity: number;

  @Expose()
  note: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;

  @Expose()
  @Type(() => UserDto)
  performedBy: UserDto;

  @Expose()
  @Type(() => PurchaseOrderDto)
  relatedPo?: PurchaseOrderDto;
}
