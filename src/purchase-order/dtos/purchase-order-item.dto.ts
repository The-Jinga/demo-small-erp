import { Expose, Type } from 'class-transformer';
import { ProductDto } from '../../product/dtos/product.dto';
import { Permission } from '../../common/enums/permission.enum';

export class PurchaseOrderItemDto {
  @Expose() id: string;
  @Expose() quantity: number;

  @Expose({ groups: [Permission.VIEW_FINANCIAL_FIELDS] })
  unitPrice: string;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;
}
