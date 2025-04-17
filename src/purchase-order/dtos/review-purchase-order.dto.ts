import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseOrderStatus } from 'src/common/enums';

export class ReviewPurchaseOrderDto {
  @ApiProperty({
    enum: [PurchaseOrderStatus.APPROVED, PurchaseOrderStatus.REJECTED],
    description: 'Review action: must be either approved or rejected',
    example: PurchaseOrderStatus.APPROVED,
  })
  @IsIn([PurchaseOrderStatus.APPROVED, PurchaseOrderStatus.REJECTED])
  action: PurchaseOrderStatus;

  @ApiPropertyOptional({
    description: 'Optional comment or reason for approval/rejection',
    example: 'The PO is missing supplier quotations.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
