import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/common/enums/permission.enum';

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ required: false })
  @Expose({ groups: [Permission.VIEW_FINANCIAL_FIELDS] })
  unitPrice: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  pendingStock: number;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}
