import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StockOutItemDto {
  @ApiProperty({
    description: 'UUID of the product being removed from stock',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product to be deducted',
    example: 5,
  })
  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @ApiProperty({
    description: 'Optional note or reason for stock out',
    example: 'Damaged during transport',
    required: false,
  })
  @IsString()
  @IsOptional()
  note: string;
}

export class StockOutDto {
  @ApiProperty({
    type: [StockOutItemDto],
    description: 'List of items to be deducted from stock',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockOutItemDto)
  items: StockOutItemDto[];
}
