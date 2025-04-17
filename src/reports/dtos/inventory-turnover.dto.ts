import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class InventoryTurnoverDto {
  @ApiProperty({ description: 'Product ID' })
  @Expose()
  productId: string;

  @ApiProperty({ description: 'Product Name' })
  @Expose()
  productName: string;

  @ApiProperty({ description: 'Total quantity stock in' })
  @Expose()
  totalIn: number;

  @ApiProperty({ description: 'Total quantity stock out' })
  @Expose()
  totalOut: number;

  @ApiProperty({ description: 'Turnover rate' })
  @Expose()
  turnoverRate: number;
}
