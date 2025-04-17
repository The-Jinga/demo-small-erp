// src/reports/dtos/supplier-spending.dto.ts
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MonthlyDataDto {
  @ApiProperty({ description: 'Month' })
  @Expose()
  month: string;

  @ApiProperty({ description: 'Total amount spent' })
  @Expose()
  totalSpent: number;

  @ApiProperty({ description: 'Average order value' })
  @Expose()
  averageOrderValue: number;

  @ApiProperty({ description: 'Order count' })
  @Expose()
  orderCount: number;
}

export class SupplierSpendingDto {
  @ApiProperty({ description: 'Supplier ID' })
  @Expose()
  supplierId: string;

  @ApiProperty({ description: 'Supplier Name' })
  @Expose()
  supplierName: string;

  @ApiProperty({ description: 'Monthly spending data' })
  @Expose()
  @Type(() => MonthlyDataDto)
  monthlyData: MonthlyDataDto[];
}
