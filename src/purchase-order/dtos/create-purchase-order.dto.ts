import {
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseOrderItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity to order' })
  @IsNotEmpty()
  quantity: number;
}

export class CreatePurchaseOrderDto {
  @ApiProperty({ description: 'Supplier ID' })
  @IsString()
  @IsNotEmpty()
  supplierId: string;

  @ApiProperty({
    description: 'Items to order',
    type: [CreatePurchaseOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  items: CreatePurchaseOrderItemDto[];

  @ApiProperty({ description: 'Optional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
